import fs from 'fs';
import chalk from 'chalk';
import osenv from 'osenv';
import path from 'path';

import Feflow from '@/core';
import { CommandPickConfig, CommandType } from '@/core/command-picker';
import createLogger from '@/core/logger';
import { Plugin } from '@/core/universal-pkg/schema/plugin';
import { parseYaml } from '@/shared/yaml';
import { FEFLOW_ROOT, UNIVERSAL_PLUGIN_CONFIG } from '@/shared/constant';

import compose from './compose';

export default function applyPlugins(plugins: string[]) {
  return (ctx: Feflow) => {
    if (!plugins.length) {
      return;
    }
    const pickConfig = new CommandPickConfig(ctx);

    const chain = plugins.map((name) => {
      const home = path.join(osenv.home(), FEFLOW_ROOT);
      const pluginPath = path.join(home, 'node_modules', name);
      pickConfig.registerSubCommand(CommandType.PLUGIN_TYPE, ctx.commander.store, name);

      try {
        ctx.logger.debug('Plugin loaded: %s', chalk.magenta(name));
        const pluginLogger = createLogger({
          debug: Boolean(ctx.args.debug),
          silent: Boolean(ctx.args.silent),
          name,
        });
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        return require(pluginPath)(Object.assign({}, ctx, { logger: pluginLogger }));
      } catch (err) {
        ctx.fefError.printError({ error: err, msg: 'command load failed: %s', pluginPath });
      }
      return [];
    });

    compose(...chain);
    pickConfig.registerSubCommand(CommandType.PLUGIN_TYPE, ctx.commander.store);
    pickConfig.updateCache(CommandType.PLUGIN_TYPE);
  };
}

export function resolvePlugin(ctx: Feflow, repoPath: string): Plugin {
  const pluginFile = path.join(repoPath, UNIVERSAL_PLUGIN_CONFIG);
  const exists = fs.existsSync(pluginFile);
  if (!exists) {
    throw new Error(`the ${UNIVERSAL_PLUGIN_CONFIG} file was not found`);
  }
  let config;
  try {
    config = parseYaml(pluginFile);
  } catch (e) {
    throw new Error(`the ${UNIVERSAL_PLUGIN_CONFIG} file failed to resolve, please check the syntax, e: ${e}`);
  }
  return new Plugin(ctx, repoPath, config);
}
