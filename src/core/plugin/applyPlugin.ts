import compose from './compose';
import osenv from 'osenv';
import path from 'path';
import { FEFLOW_ROOT } from '../../shared/constant';

export default function applyPlugins(plugins: any) {
    return (ctx: any) => {
      if (!plugins.length) {
        return;
      }
      const chain = plugins.map((plugin: any) => {
        const home = path.join(osenv.home(), FEFLOW_ROOT);
        const pluginPath = path.join(home, 'node_modules', plugin);
        try {
          return require(pluginPath)(ctx);
        } catch (ex) {
          ctx.logger.debug(`plugin ${ plugin } load fail, exception message ${ ex }`);
        }
      });

      return compose(...chain);
    }
}