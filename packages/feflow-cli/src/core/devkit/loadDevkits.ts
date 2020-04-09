import path from 'path';
import Config from './config';
import getOptionFromCommand from "./commandOptions";

const registerDevkitCommand = (command: any, commandConfig: any, directoryPath: any, ctx: any) => {
  const builder = commandConfig.builder;
  const [ packageName ] = builder.split(':', 2);
  const config = new Config(ctx);
  const pkgPath = path.join(directoryPath, 'node_modules', packageName);
  try {
    const devkitConfig = config.loadDevkitConfig(pkgPath);
    const { implementation, description, optionsDescription = {} } = devkitConfig.builders[command];

    const options = getOptionFromCommand(optionsDescription);
    if (Array.isArray(implementation)) {
      ctx.commander.register(command, description, async () => {
        for (let i = 0; i < implementation.length; i ++) {
          const action = path.join(pkgPath, implementation[i]);
          await require(action)(ctx);
        }
      }, options);
    } else {
      const action = path.join(pkgPath, implementation);
      ctx.commander.register(command, description, () => {
        require(action)(ctx);
      }, options);
    }
  } catch (e) {
    ctx.logger.debug(`${ pkgPath } not found!`);
  }
};

export default function loadDevkits(ctx: any): Promise<void> {
  const config = new Config(ctx);
  const configData = config.loadProjectConfig();
  const directoryPath = config.getProjectDirectory();

  return new Promise<any>((resolve, reject) => {
    if (configData) {
      ctx.projectPath = directoryPath;
      ctx.projectConfig = configData;
      if (configData.devkit && configData.devkit.commands) {
        const commandsConfig = configData.devkit.commands;
        for (const command in commandsConfig) {
          const commandConfig = commandsConfig[command];
          registerDevkitCommand(command, commandConfig, directoryPath, ctx);
        }
      } else {
        ctx.logger.error('Your project config is not correct.');
      }
    } else {
      ctx.logger.debug('Run commands not in a feflow project.');
    }
    resolve();
  });
}
