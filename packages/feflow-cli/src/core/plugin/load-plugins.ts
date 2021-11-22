import fs from 'fs';
import path from 'path';
import Feflow from '@/core';
import applyPlugins from './apply-plugins';

export const getPluginsList = (ctx: Feflow): [unknown | Error, Array<string>] => {
  const { root, rootPkg } = ctx;
  let pluginList: string[] = [];
  let err = null;
  let json: {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  } = {};
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
  pluginList = Object.keys(deps).filter((name) => {
    if (!/^feflow-plugin-|^@[^/]+\/feflow-plugin-/.test(name)) {
      return false;
    }
    const pluginPath = path.join(root, 'node_modules', name);
    return fs.existsSync(pluginPath);
  });

  return [err, pluginList];
};

export default function loadPlugins(ctx: Feflow): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const [err, plugins] = getPluginsList(ctx);
    if (err) {
      reject(err);
    }
    applyPlugins(plugins)(ctx);
    resolve();
  });
}
