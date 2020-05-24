import path from 'path';
import { parseYaml } from '../../shared/yaml';
import { Plugin } from '../universal-pkg/schema/plugin';
import { UniversalPkg } from '../universal-pkg/dep/pkg';
import { 
  UNIVERSAL_MODULES, 
  UNIVERSAL_PLUGIN_CONFIG,
  FEFLOW_BIN
} from '../../shared/constant';
import Binp from '../universal-pkg/binp';
import Commander from '../commander';

const toolRegex = /^feflow-(?:devkit|plugin)-(.*)/i;

function register(ctx: any, pkg: string, version: string, global = false) {
  const commander: Commander = ctx.commander;
  const pluginPath = path.join(ctx.root, UNIVERSAL_MODULES, `${pkg}@${version}`);
  const pluginConfigPath = path.join(pluginPath, UNIVERSAL_PLUGIN_CONFIG)
  const config = parseYaml(pluginConfigPath) || {};
  const plugin = new Plugin(ctx, pluginPath, config);
  const pluginCommand = (toolRegex.exec(pkg) || [])[1];
  if (!pluginCommand) {
    ctx.logger.debug(`invalid universal plugin name: ${pluginCommand}`);
    return;
  }
  if (global) {
    const pluginDescriptions = plugin.desc || `${pkg} universal plugin description`;
    commander.register(pluginCommand, pluginDescriptions, () => {
      // make it find dependencies
      new Binp().register(path.join(pluginPath, `.${FEFLOW_BIN}`), true, true);
      plugin.preRun.run();
      const args = process.argv.slice(3);
      plugin.command.run(...args);
      plugin.postRun.run();
    });
  } else {
    commander.registerInvisible(`${pluginCommand}@${version}`, () => {
      plugin.preRun.run();
      const args = process.argv.slice(3);
      plugin.command.run(...args);
      plugin.postRun.run();
    });
  }
}

export default async function loadUniversalPlugin(ctx: any): Promise<any> {
  const universalPkg: UniversalPkg = ctx.universalPkg;

  const installed = universalPkg.getInstalled();
  for (const [pkg, version] of installed) {
    register(ctx, pkg, version, true);
  }

  const relations = universalPkg.getRelations();
  for (const [pkg, versionRelations] of relations) {
    for (const [version] of versionRelations) {
      register(ctx, pkg, version, false);
    }
  }

}
