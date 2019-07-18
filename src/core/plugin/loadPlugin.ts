import fs from 'fs';
import osenv from 'osenv';
import path from 'path';
import Feflow from "../index"
import { Plugins } from "./index"

export default function loadPlugins(ctx: Feflow): Promise<Plugins> {

  const { root, rootPkg } = ctx;

  return new Promise<any>((resolve, reject) => {
    fs.readFile(rootPkg, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const json = JSON.parse(data);
        const deps = json.dependencies || json.devDependencies || {};
        const plugins = Object.keys(deps).filter((name) => {
          if (!/^feflow-plugin-|^@[^/]+\/feflow-plugin-/.test(name)) {
            return false;
          }
          const pluginPath = path.join(root, 'node_modules', name);
          return fs.existsSync(pluginPath);
        });
        resolve(plugins);
      }
    });
  });
}