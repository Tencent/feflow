import fs from 'fs';
import path from 'path';
import { parseYaml } from '../../shared/yaml';
// import spawn from 'cross-spawn';
import shelljs from 'shelljs';
import os from 'os';

//
// 1. 目录读取
// 2. 统一插件的配置读取 command、description、options
// 3. 变量替换
// 4. 获取平台
// 5. 运行 child_process.execFileSync运行插件

// TODO
// descriptions/options

type universalPluginCommandMap = {
  default?: string;
  windows?: string;
  linux?: string;
  mac?: string;
};

const universalPluginConfigName = 'plugin.yml';
const universalPluginDirName = 'universal_modules';
const universalPluginPkgName = 'universal-package.json';
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

export default function loadUniversalPlugins(ctx: any): Promise<void> {
  const { root, logger } = ctx;
  const universalPluginPkg = path.resolve(root, universalPluginDirName, universalPluginPkgName);
  return new Promise((resolve, reject) => {
    fs.readFile(universalPluginPkg, 'utf8', (err, data) => {
      if (err) {
        logger.debug(err);
        reject(err);
      }

      const universalPluginPkgConfig = JSON.parse(data);
      const { dependencies = [] } = universalPluginPkgConfig;

      Object.keys(dependencies).forEach(universalPluginName => {
        const universalPluginPath = path.resolve(root, universalPluginDirName, universalPluginName);
        const universalPluginConfigPath = path.resolve(
          root,
          universalPluginDirName,
          universalPluginName,
          universalPluginConfigName,
        );
        const universalPluginCommand = (toolRegex.exec(universalPluginName) || [])[1];

        if (!universalPluginCommand) {
          logger.debug(`${universalPluginCommand} 命名不规范`);
          return;
        }

        if (fs.existsSync(universalPluginConfigPath)) {
          const config = parseYaml(universalPluginConfigPath);
          const { command, description } = config;
          const commandMap: universalPluginCommandMap = {};

          Object.keys(command).forEach(platform => {
            // TODO
            // 变量替换
            commandMap[platform] = command[platform].replace(/\${var:td}/g, universalPluginPath);
          });

          ctx.commander.register(universalPluginCommand, description || 'lint your code', () => {
            const commandStr = [];
            commandStr.push(commandMap[platform] || commandMap.default);
            commandStr.push(...process.argv.slice(3));
            logger.debug('commandStr', commandStr.join(' '));
            shelljs.exec(commandStr.join(' '));
          });
        }
      });

      resolve();
    });
  });
}
