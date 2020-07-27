import fs from 'fs';
import path from 'path';
import applyPlugins from './applyPlugins';

export const getPluginsList = (ctx: any): [Error, Array<string>] => {
  const { root, rootPkg } = ctx;
  let pluginList: any = [];
  let err = null;
  let json: any = {};
  try {
    const data = fs.readFileSync(rootPkg, 'utf-8');
    json = JSON.parse(data);
  } catch (error) {
    err = error;
  }

  if (!json.dependencies) {
    return [err, pluginList];
  }

  const deps = json.dependencies || json.devDependencies || {};
  const plugins = Object.keys(deps).filter((name) => {
    if (!/^feflow-plugin-|^@[^/]+\/feflow-plugin-/.test(name)) {
      return false;
    }
    const pluginPath = path.join(root, 'node_modules', name);
    return fs.existsSync(pluginPath);
  });

  pluginList = plugins;

  return [err, pluginList];
};

export default function loadPlugins(ctx: any): Promise<void> {
  return new Promise<any>((resolve, reject) => {
    const [err, plugins] = getPluginsList(ctx);
    if (err) {
      reject(err);
    }
    applyPlugins(plugins)(ctx);
    resolve();
  });
}
