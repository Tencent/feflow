import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

import Feflow from '@/core';
import { UniversalPkg } from '@/core/universal-pkg/dep/pkg';
import { resolvePlugin } from '@/core/plugin/apply-plugins';
import { FEFLOW_PLUGIN_GIT_PREFIX, FEFLOW_PLUGIN_LOCAL_PREFIX, FEFLOW_PLUGIN_PREFIX } from '@/shared/constant';

export default (ctx: Feflow) => {
  ctx.commander.register('list', 'Show all plugins installed.', () => {
    const list = loadModuleList(ctx);
    const universalPlugins = loadUniversalPlugin(ctx);
    list.push(...universalPlugins);

    console.log('You can search more templates or plugins through https://feflowjs.com/encology/');
    if (!list.length) {
      console.log(chalk.magenta('No templates and plugins have been installed'));
      return;
    }

    const plugins: typeof list = [];
    const templates: typeof list = [];
    list.forEach((item) => {
      if (/generator-|^@[^/]+\/generator-/.test(item.name)) {
        templates.push(item);
      } else {
        plugins.push(item);
      }
    });
    console.log('templates');
    if (templates.length === 0) {
      console.log(chalk.magenta('No templates have been installed'));
    } else {
      templates.forEach((item) => console.log(chalk.magenta(`${item.name}(${item.version})`)));
    }
    const storePlugins: typeof list = [];
    const gitPlugins: typeof list = [];
    const localPlugins: typeof list = [];
    plugins.forEach((item) => {
      if (item.name.startsWith(FEFLOW_PLUGIN_GIT_PREFIX)) {
        gitPlugins.push(item);
      } else if (item.name.startsWith(FEFLOW_PLUGIN_LOCAL_PREFIX)) {
        localPlugins.push(item);
      } else if (item.name.startsWith(FEFLOW_PLUGIN_PREFIX) || /^@[^/]+\/feflow-plugin-/.test(item.name)) {
        storePlugins.push(item);
      }
    });
    console.log('plugins');
    if (storePlugins.length === 0 && gitPlugins.length === 0) {
      console.log(chalk.magenta('No plugins have been installed'));
    } else {
      storePlugins.forEach((item) => console.log(chalk.magenta(`${item.name}(${item.version})`)));
    }
    if (gitPlugins.length > 0) {
      console.log('git plugins');
      gitPlugins.forEach((gitPlugin) => {
        const url = `http://${decodeURIComponent(gitPlugin.name.replace(FEFLOW_PLUGIN_GIT_PREFIX, ''))}`;
        showPlugin(ctx, url, gitPlugin);
      });
    }
    if (localPlugins.length > 0) {
      console.log('local plugins');
      localPlugins.forEach((localPlugin) => {
        const localPath = decodeURIComponent(localPlugin.name.replace(FEFLOW_PLUGIN_LOCAL_PREFIX, ''));
        showPlugin(ctx, localPath, localPlugin);
      });
    }
  });
};

interface PluginInfo {
  name: string;
  version: string;
}

function loadModuleList(ctx: Feflow): PluginInfo[] {
  const packagePath = ctx.rootPkg;
  const pluginDir = path.join(ctx.root, 'node_modules');
  const extend = function (target: object, source: object) {
    const targetCopy = { ...target };
    Object.entries(source).forEach(([key, value]) => {
      targetCopy[key] = value;
    });
    return targetCopy;
  };
  if (fs.existsSync(packagePath)) {
    const content = fs.readFileSync(packagePath, 'utf8');
    const json = JSON.parse(content);
    const deps = extend(json.dependencies || {}, json.devDependencies || {});
    const keys = Object.keys(deps);
    return keys
      .filter((name) => {
        if (!/^feflow-plugin-|^@[^/]+\/feflow-plugin-|generator-|^@[^/]+\/generator-/.test(name)) return false;
        const pluginPath = path.join(pluginDir, name);
        return fs.existsSync(pluginPath);
      })
      .map((key) => ({
        name: key,
        version: getModuleVersion(pluginDir, key),
      }));
  }
  return [];
}

function getModuleVersion(dir: string, name: string): string {
  const packagePath = path.resolve(dir, name, 'package.json');
  if (fs.existsSync(packagePath)) {
    const content = fs.readFileSync(packagePath, 'utf8');
    const json = JSON.parse(content);
    return json?.version || 'unknown';
  }
  return 'unknown';
}

function loadUniversalPlugin(ctx: Feflow): PluginInfo[] {
  const { universalPkg }: { universalPkg: UniversalPkg } = ctx;
  const availablePlugins: {
    name: string;
    version: string;
  }[] = [];

  for (const [pkg, version] of universalPkg.getInstalled()) {
    availablePlugins.push({
      name: pkg,
      version,
    });
  }

  return availablePlugins;
}

function showPlugin(ctx: Feflow, from: string, pluginInfo: PluginInfo) {
  const repoPath = path.join(ctx?.universalModules, `${pluginInfo.name}@${pluginInfo.version}`);
  let useCommand = pluginInfo.name.replace(FEFLOW_PLUGIN_PREFIX, '');
  const plugin = resolvePlugin(ctx, repoPath);
  if (plugin.name) {
    useCommand = plugin.name;
  }
  console.log(chalk.magenta(`${from}(command: ${useCommand}, version: ${pluginInfo.version})`));
}
