import path from 'path';

import Feflow from '..';
import Binp from '../universal-pkg/binp';
import { CommandPickConfig, CommandType } from '../command-picker';
import { Plugin } from '../universal-pkg/schema/plugin';

import { parseYaml } from '../../shared/yaml';
import {
  UNIVERSAL_MODULES,
  UNIVERSAL_PLUGIN_CONFIG,
  FEFLOW_BIN,
  FEF_ENV_PLUGIN_PATH,
  SILENT_ARG,
  DISABLE_ARG,
} from '../../shared/constant';
import { escape } from '../../shared/args';

const toolRegex = /^feflow-(?:devkit|plugin)-(.*)/i;

const excludeAgrs = [DISABLE_ARG, SILENT_ARG];

export function loadPlugin(ctx: Feflow, pkg: string, version: string): Plugin {
  const pluginPath = path.join(ctx.root, UNIVERSAL_MODULES, `${pkg}@${version}`);
  const pluginConfigPath = path.join(pluginPath, UNIVERSAL_PLUGIN_CONFIG);
  const config = parseYaml(pluginConfigPath) || {};
  return new Plugin(ctx, pluginPath, config);
}

function register(ctx: Feflow, pkg: string, version: string, global = false) {
  const { commander } = ctx;
  const pluginCommand = (toolRegex.exec(pkg) || [])[1] || pkg;
  if (!pluginCommand) {
    ctx.logger.debug(`invalid universal plugin name: ${pluginCommand}`);
    return;
  }
  if (global) {
    // load plugin.yml delay
    commander.register(
      pluginCommand,
      () => loadPlugin(ctx, pkg, version).desc || `${pkg} universal plugin description`,
      async () => {
        await execPlugin(ctx, pkg, version);
      },
      [
        () => {
          const plugin = loadPlugin(ctx, pkg, version);
          return plugin.usage
            ? {
                type: 'usage',
                content: plugin.usage,
              }
            : {
                type: 'path',
                content: plugin.path,
              };
        },
      ],
      pkg,
    );
  } else {
    commander.registerInvisible(
      `${pluginCommand}@${version}`,
      async () => {
        await execPlugin(ctx, pkg, version);
      },
      [],
      `${pkg}@${version}`,
    );
  }
}

export async function execPlugin(ctx: Feflow, pkg: string, version: string) {
  const pluginPath = path.join(ctx.root, UNIVERSAL_MODULES, `${pkg}@${version}`);
  const plugin = loadPlugin(ctx, pkg, version);
  // make it find dependencies
  new Binp().register(path.join(pluginPath, `.${FEFLOW_BIN}`), true, true);
  // injection plugin path into the env
  process.env[FEF_ENV_PLUGIN_PATH] = pluginPath;
  plugin.preRun.run();
  const args = process.argv
    .slice(3)
    .filter((arg) => {
      if (excludeAgrs.includes(arg)) {
        return false;
      }
      return true;
    })
    .map((arg) => escape(arg));
  plugin.command.run(...args);
  plugin.postRun.runLess();
}

export default function loadUniversalPlugin(ctx: Feflow) {
  const { universalPkg } = ctx;
  const pickConfig = new CommandPickConfig(ctx);

  const installed = universalPkg.getInstalled();
  for (const [pkg, version] of installed) {
    pickConfig.registerSubCommand(CommandType.UNIVERSAL_PLUGIN_TYPE, ctx.commander.store, pkg, version);
    register(ctx, pkg, version, true);
  }

  const dependencies = universalPkg.getAllDependencies();
  for (const [pkg, versionRelations] of dependencies) {
    for (const [version] of versionRelations) {
      register(ctx, pkg, version, false);
    }
  }

  pickConfig.registerSubCommand(CommandType.UNIVERSAL_PLUGIN_TYPE, ctx.commander.store);
  pickConfig.updateCache(CommandType.UNIVERSAL_PLUGIN_TYPE);
}
