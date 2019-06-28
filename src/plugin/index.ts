import fs from 'fs';
import osenv from 'osenv';
import path from 'path';

const compose = (...funcs: any) => {
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce((a: any, b: any) => (...args: any) => a(b(...args)));
}

export function applyPlugins(plugins: any) {
  return (ctx: any) => {
    const chain = plugins.map((plugin: any) => {
      const home = path.join(osenv.home(), './.feflow');
      const pluginPath = path.join(home, 'node_modules', plugin);
      return require(pluginPath)(ctx);
    });

    return compose(...chain);
  }
}

export function loadPlugins(): Promise<void> {
  const home = path.join(osenv.home(), './.feflow');
  const homePkg = path.join(home, 'package.json');

  return new Promise<any>((resolve, reject) => {
    fs.readFile(homePkg, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const json = JSON.parse(data);
        const deps = json.dependencies || json.devDependencies;
        const plugins = Object.keys(deps).filter((name) => {
          if (!/^feflow-plugin-|^@[^/]+\/feflow-plugin-/.test(name)) {
            return false;
          }
          const pluginPath = path.join(home, 'node_modules', name);
          return fs.existsSync(pluginPath);
        });
        resolve(plugins);
      }
    });
  });
}