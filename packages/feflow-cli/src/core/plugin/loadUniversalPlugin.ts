import fs from 'fs';
import path from 'path';
import { parseYaml } from '../../shared/yaml';
import { Plugin } from '../universal-pkg/schema/plugin';
import { 
  UNIVERSAL_MODULES, 
  UNIVERSAL_PKG_JSON, 
  UNIVERSAL_PLUGIN_CONFIG
} from '../../shared/constant';


type PluginPkgConfig = {
  dependencies: object;
  version: string;
  name: string;
};

const toolRegex = /^feflow-(?:devkit|plugin)-(.*)/i;


export default function loadUniversalPlugin(ctx: any): Promise<any> {
  const { root, logger } = ctx;
  const pluginPkg = path.resolve(root, UNIVERSAL_PKG_JSON);

  if (!fs.existsSync(pluginPkg)) {
    logger.debug(`${pluginPkg} is not found`);
    return Promise.resolve();
  }

  return new Promise(resolve => {
    fs.readFile(pluginPkg, 'utf8', async (err, data) => {
      if (err) {
        logger.debug(err);
        resolve();
      }

      let pluginPkgConfig = {} as PluginPkgConfig;
      try {
        pluginPkgConfig = JSON.parse(data);
      } catch (error) {
        logger.debug(`can not parse plugin package: ${pluginPkg}`);
        resolve();
      }

      // traverse universal plugins and register command
      const { dependencies = {} } = pluginPkgConfig;
      for (const pluginName of Object.keys(dependencies)) {
        const pluginPath = path.resolve(root, UNIVERSAL_MODULES, `${pluginName}@${dependencies[pluginName]}`);
        const pluginConfigPath = path.resolve(pluginPath, UNIVERSAL_PLUGIN_CONFIG);

        // get universal plugin command, like fef [universal-plugin-command]
        const pluginCommand = (toolRegex.exec(pluginName) || [])[1];
        if (!pluginCommand) {
          logger.debug(`invalid universal plugin name: ${pluginCommand}`);
          return;
        }

        if (fs.existsSync(pluginConfigPath)) {
          const config = parseYaml(pluginConfigPath) || {};
          const plugin = new Plugin(ctx, pluginPath, config);
          await plugin.check()

          const pluginDescriptions = plugin.desc || `${pluginCommand} universal plugin description`;

          ctx.commander.register(pluginCommand, pluginDescriptions, () => {
            plugin.preRun.run();
            const args = process.argv.slice(3);
            plugin.command.run(...args);
            plugin.postRun.run();
          });
        }
      }

      resolve();
    });
  });
}
