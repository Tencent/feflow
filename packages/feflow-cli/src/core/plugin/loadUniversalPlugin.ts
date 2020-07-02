import path from 'path';
import { parseYaml } from '../../shared/yaml';
import { Plugin } from '../universal-pkg/schema/plugin';
import { UniversalPkg } from '../universal-pkg/dep/pkg';
import {
  UNIVERSAL_MODULES,
  UNIVERSAL_PLUGIN_CONFIG,
  FEFLOW_BIN,
  FEF_ENV_PLUGIN_PATH
} from '../../shared/constant';
import Binp from '../universal-pkg/binp';
import Commander from '../commander';
const { updateUniversalPlugin } = require('../native/install');

const toolRegex = /^feflow-(?:devkit|plugin)-(.*)/i;

const excludeAgrs = ['--disable-check']

function loadPlugin(
  ctx: any,
  pkg: string,
  version: string
): Plugin {
  const pluginPath = path.join(
    ctx.root,
    UNIVERSAL_MODULES,
    `${pkg}@${version}`
  );
  const pluginConfigPath = path.join(pluginPath, UNIVERSAL_PLUGIN_CONFIG);
  const config = parseYaml(pluginConfigPath) || {};
  return new Plugin(ctx, pluginPath, config);
}

function register(ctx: any, pkg: string, version: string, global = false) {
  const commander: Commander = ctx.commander;
  let plugin = loadPlugin(ctx, pkg, version);
  const pluginCommand = (toolRegex.exec(pkg) || [])[1];
  if (!pluginCommand) {
    ctx.logger.debug(`invalid universal plugin name: ${pluginCommand}`);
    return;
  }
  if (global) {
    const universalPkg: UniversalPkg = ctx.universalPkg;
    const pluginDescriptions = plugin.desc || `${pkg} universal plugin description`;
    const usage = plugin.usage ? {
      type: "usage",
      content: plugin.usage
    } : {
      type: "path",
      content: plugin.path
    };
    commander.register(pluginCommand, pluginDescriptions, async () => {
      await updateUniversalPlugin(ctx, pkg, version, plugin);
      const newVersion = universalPkg.getInstalled().get(pkg);
      if (!newVersion) {
        ctx.logger.error(`invalid universal plugin name: ${pluginCommand}`);
        return;
      } 
      plugin = loadPlugin(ctx, pkg, newVersion);
      await execPlugin(ctx, pkg, newVersion, plugin);
    }, [usage], pkg);
  } else {
    commander.registerInvisible(`${pluginCommand}@${version}`, async () => {
      await execPlugin(ctx, pkg, version, plugin);
    }, [], `${pkg}@${version}`);
  }
}

async function execPlugin(
  ctx: any,
  pkg: string,
  version: string,
  plugin: Plugin
) {
  const pluginPath = path.join(
    ctx.root,
    UNIVERSAL_MODULES,
    `${pkg}@${version}`
  );
  // make it find dependencies
  new Binp().register(path.join(pluginPath, `.${FEFLOW_BIN}`), true, true);
  // injection plugin path into the env
  process.env[FEF_ENV_PLUGIN_PATH] = pluginPath;
  plugin.preRun.run();
  const args = process.argv.slice(3).filter(arg => {
    if (excludeAgrs.includes(arg)) {
      return false;
    }
    return true;
  }).map(arg => {
    if (!/^'.*'$/.test(arg)) {
      return `'${arg}'`;
    }
    return arg;
  });
  try {
    plugin.command.run(...args);
  } catch(e) {
    process.exit(e?.status || 2)
  }
  plugin.postRun.runLess();
}

export default async function loadUniversalPlugin(ctx: any): Promise<any> {
  const universalPkg: UniversalPkg = ctx.universalPkg;

  const installed = universalPkg.getInstalled();
  for (const [pkg, version] of installed) {
    register(ctx, pkg, version, true);
  }

  const dependencies = universalPkg.getAllDependencies();
  for (const [pkg, versionRelations] of dependencies) {
    for (const [version] of versionRelations) {
      register(ctx, pkg, version, false);
    }
  }
}
