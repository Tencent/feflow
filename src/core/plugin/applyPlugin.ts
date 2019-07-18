import compose from './compose';
import osenv from 'osenv';
import path from 'path';
import { Plugins } from "./index"

export default function applyPlugins(plugins: Plugins) {
    return (ctx: any) => {
      if (!plugins.length) {
        return;
      }
      const chain = plugins.map((plugin: any) => {
        const home = path.join(osenv.home(), './.feflow');
        const pluginPath = path.join(home, 'node_modules', plugin);
        try {
          return require(pluginPath)(ctx);
        } catch (ex) {
          ctx.logger.debug('plugin load fail', plugin);
        }
      });

      return compose(...chain);
    }
}