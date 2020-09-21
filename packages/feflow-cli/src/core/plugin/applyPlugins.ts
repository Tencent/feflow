import compose from './compose';
import chalk from 'chalk';
import osenv from 'osenv';
import path from 'path';
import { FEFLOW_ROOT } from '../../shared/constant';
import { CommandPickConfig,COMMAND_TYPE } from '../command-picker';

export default function applyPlugins(plugins: any[]) {
  return (ctx: any) => {
    if (!plugins.length) {
      return;
    }
    const pickConfig = new CommandPickConfig(ctx);

    const chain = plugins.map((name: any) => {
      const home = path.join(osenv.home(), FEFLOW_ROOT);
      const pluginPath = path.join(home, 'node_modules', name);
      pickConfig.registSubCommand(COMMAND_TYPE.PLUGIN_TYPE, ctx.commander.store, name);

      try {
        ctx.logger.debug('Plugin loaded: %s', chalk.magenta(name));
        return require(pluginPath)(ctx);
      } catch (err) {
        ctx.logger.error(
          { err: err },
          'Plugin load failed: %s',
          chalk.magenta(name)
        );
      }
    });

    compose(...chain);
    pickConfig.registSubCommand(COMMAND_TYPE.PLUGIN_TYPE, ctx.commander.store);
    pickConfig.updateCache(COMMAND_TYPE.PLUGIN_TYPE);
  };
}
