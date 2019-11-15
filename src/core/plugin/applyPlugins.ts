import compose from './compose';
import chalk from 'chalk';
import osenv from 'osenv';
import path from 'path';
import { FEFLOW_ROOT } from '../../shared/constant';

export default function applyPlugins(plugins: string[]) {
    return (ctx: FeflowInterface) => {
      if (!plugins.length) {
        return;
      }
      const chain = plugins.map((name: string) => {
        const home = path.join(osenv.home(), FEFLOW_ROOT);
        const pluginPath = path.join(home, 'node_modules', name);
        try {
          ctx.logger.debug('Plugin loaded: %s', chalk.magenta(name));
          return require(pluginPath)(ctx);
        } catch (err) {
          ctx.logger.error({err: err}, 'Plugin load failed: %s', chalk.magenta(name));
        }
      });

      return compose(...chain);
    }
}