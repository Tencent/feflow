/* eslint-disable @typescript-eslint/no-require-imports */
import path from 'path';
import Config from './config';
import getCommandLine from './command-options';
import Feflow from '../';
import logger from '../logger';
import { FEFLOW_ROOT } from '../../shared/constant';

interface CommandConfig {
  builder: string;
  options?: object;
}

const registerDevkitCommand = (command: string, commandConfig: CommandConfig, directoryPath: string, ctx: Feflow) => {
  const { builder, options: builderOptions } = commandConfig;
  const [packageName] = builder.split(':', 2);
  const config = new Config(ctx);
  const pkgPath = path.join(directoryPath, 'node_modules', packageName);
  try {
    const devkitConfig = config.loadDevkitConfig(pkgPath);
    if (!devkitConfig) {
      ctx.logger.debug(`devkit config not found!`);
      return;
    }
    const { implementation, description, optionsDescription, usage = {} } = devkitConfig.builders[command];

    const options = getCommandLine(optionsDescription || usage, description, command);
    const devkitLogger = logger({
      debug: Boolean(ctx.args.debug),
      silent: Boolean(ctx.args.silent),
      name: packageName,
    });
    if (Array.isArray(implementation)) {
      ctx.commander.register(
        command,
        description,
        async () => {
          for (const implementationItem of implementation) {
            const action = path.join(pkgPath, implementationItem);
            await require(action)(Object.assign({}, ctx, { logger: devkitLogger, options: builderOptions }));
          }
        },
        options,
        packageName,
      );
    } else {
      const action = path.join(pkgPath, implementation);
      ctx.commander.register(
        command,
        description,
        () => {
          require(action)(Object.assign({}, ctx, { logger: devkitLogger, options: builderOptions }));
        },
        options,
        packageName,
      );
    }
  } catch (e) {
    ctx.logger.debug(`${pkgPath} not found!`);
  }
};

export default function loadDevkits(ctx: Feflow) {
  const config = new Config(ctx);
  const configData = config.loadProjectConfig();
  const directoryPath = config.getProjectDirectory();

  if (configData) {
    ctx.projectPath = directoryPath;
    ctx.projectConfig = configData;
    if (configData.devkit?.commands) {
      const commandsConfig = configData.devkit.commands as Record<string, CommandConfig>;
      Object.entries(commandsConfig).forEach(([key, commandConfig]) => {
        registerDevkitCommand(key, commandConfig, directoryPath, ctx);
      });
    } else {
      if (path.basename(directoryPath) === FEFLOW_ROOT) {
        ctx.logger.debug('Run commands in .fef root will not work.');
      } else {
        ctx.logger.error(
          `A config file .feflowrc(.js|.yaml|.yml|.json) was detected in ${directoryPath}, but lost required property 'commands' in field 'devkit'. Please check your config file or just delete it.`,
        );
      }
    }
  } else {
    ctx.logger.debug('Run commands not in a feflow project.');
  }
}
