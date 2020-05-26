import path from 'path';
import { parseYaml } from '../../shared/yaml';
import { Plugin } from '../universal-pkg/schema/plugin';
import { UniversalPkg } from '../universal-pkg/dep/pkg';
import { 
  UNIVERSAL_MODULES, 
  UNIVERSAL_PLUGIN_CONFIG,
  FEFLOW_BIN,
  LATEST_VERSION,
  FEF_ENV_PLUGIN_PATH
} from '../../shared/constant';
import Binp from '../universal-pkg/binp';
import Commander from '../commander';
const { installPlugin } = require('../native/install');

const toolRegex = /^feflow-(?:devkit|plugin)-(.*)/i;

function loadPlugin(ctx: any, pluginPath: string, pluginConfigPath: string): Plugin {
  const config = parseYaml(pluginConfigPath) || {};
  return new Plugin(ctx, pluginPath, config);
}

function register(ctx: any, pkg: string, version: string, global = false) {
  const commander: Commander = ctx.commander;
  const pluginPath = path.join(ctx.root, UNIVERSAL_MODULES, `${pkg}@${version}`);
  const pluginConfigPath = path.join(pluginPath, UNIVERSAL_PLUGIN_CONFIG);
  let plugin = loadPlugin(ctx, pluginPath, pluginConfigPath);
  const pluginCommand = (toolRegex.exec(pkg) || [])[1];
  if (!pluginCommand) {
    ctx.logger.debug(`invalid universal plugin name: ${pluginCommand}`);
    return;
  }
  if (global) {
    const pluginDescriptions = plugin.desc || `${pkg} universal plugin description`;
    commander.register(pluginCommand, pluginDescriptions, () => {
      execPlugin(ctx, pkg, version, plugin);
    });
  } else {
    commander.registerInvisible(`${pluginCommand}@${version}`, () => {
      execPlugin(ctx, pkg, version, plugin);
    });
  }
}

async function execPlugin(ctx: any, pkg: string, version: string, plugin: Plugin) {
  const pluginPath = path.join(ctx.root, UNIVERSAL_MODULES, `${pkg}@${version}`);
  const pluginConfigPath = path.join(pluginPath, UNIVERSAL_PLUGIN_CONFIG);
  // only the latest version is automatically updated
  if (version === LATEST_VERSION && plugin.autoUpdate) {
    try {
      await installPlugin(ctx, pkg, true);
      // reload plugin
      plugin = loadPlugin(ctx, pluginPath, pluginConfigPath);
    } catch(e) {
      ctx.logger.error(`update failed, ${e}`);
    }
  }
  // make it find dependencies
  new Binp().register(path.join(pluginPath, `.${FEFLOW_BIN}`), true, true);
  // injection plugin path into the env
  process.env[FEF_ENV_PLUGIN_PATH] = pluginPath;
  plugin.preRun.run();
  const args = process.argv.slice(3);
  plugin.command.run(...args);
  plugin.postRun.run();
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
