import fs from 'fs';
import path from 'path';
import { parseYaml } from '../../shared/yaml';
import execa from 'execa';
import os from 'os';

type PluginCommandMap = {
  default: string;
  windows?: string;
  linux?: string;
  mac?: string;
};

type PluginPkgConfig = {
  dependencies: object;
  version: string;
  name: string;
};

const pluginConfigName = 'plugin.yml';
const pluginDirName = 'universal_modules';
const pluginPkgName = 'universal-package.json';
const toolRegex = /^feflow-(?:devkit|plugin)-tool-(.*)/i;

const platformMap = {
  aix: 'linux',
  freebsd: 'linux',
  linux: 'linux',
  openbsd: 'linux',
  sunos: 'linux',
  win32: 'windows',
  darwin: 'mac',
};

const platform = platformMap[os.platform()];

// environment variables in universal plugin command
// var:td  => universal plugin absolute path
const envVarsAnchors = [/\${var:td}/gi];
const envVars = [] as any;

export default function loadplugins(ctx: any): Promise<any> {
  const { root, logger } = ctx;
  const pluginPkg = path.resolve(root, pluginDirName, pluginPkgName);

  return new Promise((resolve, reject) => {
    fs.readFile(pluginPkg, 'utf8', (err, data) => {
      if (err) {
        logger.debug(err);
        reject(err);
      }

      let pluginPkgConfig = {} as PluginPkgConfig;
      try {
        pluginPkgConfig = JSON.parse(data);
      } catch (error) {
        logger.debug(`can not parse plugin package: ${pluginPkg}`);
        reject(error);
      }

      // traverse universal plugins and register command
      const { dependencies = {} } = pluginPkgConfig;
      Object.keys(dependencies).forEach(pluginName => {
        const pluginPath = path.resolve(root, pluginDirName, pluginName);
        const pluginConfigPath = path.resolve(pluginPath, pluginConfigName);
        // store pluginPath
        envVars.push(pluginPath);

        // get universal plugin command, like fef [universal-plugin-command]
        const pluginCommand = (toolRegex.exec(pluginName) || [])[1];
        if (!pluginCommand) {
          logger.debug(`invalid universal plugin name: ${pluginCommand}`);
          return;
        }

        if (fs.existsSync(pluginConfigPath)) {
          const config = parseYaml(pluginConfigPath) || {};
          const { command = {}, description } = config;
          const commandMap = {} as PluginCommandMap;
          const supportPlatform = Object.keys(command);
          if (!supportPlatform.length) {
            return logger.debug(`there is no default command in ${pluginName}`);
          }
          // parse universal plugin command form it's config ,
          // it provides kinds of command which dependencies user os platform .
          // repalce env variable
          supportPlatform.forEach(platform => {
            commandMap[platform] = envVarsAnchors.reduce((previousValue, currentEnvVar, index) => {
              return previousValue.replace(currentEnvVar, envVars[index] || '');
            }, command[platform]);
          });

          const pluginDescriptions = description || `${pluginCommand} universal plugin description`;

          // register universal command
          ctx.commander.register(pluginCommand, pluginDescriptions, () => {
            const commandGroup: string[] = [];
            const nativeArgs = process.argv.slice(3);
            commandGroup.push(commandMap[platform] || commandMap.default);
            // deliver parameters
            commandGroup.push(...nativeArgs);

            // run universal plugin
            const commandStr = commandGroup.join(' ');
            logger.debug('command: ', commandStr);
            execa.commandSync(commandStr, { shell: true, stdout: process.stdout, stderr: process.stderr });
          });
        }
      });

      resolve();
    });
  });
}
