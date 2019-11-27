import path from 'path';
import Config from './config';

const registerDevkitCommand = (command: any, commandConfig: any, directoryPath: any, ctx: any) => {
  const builder = commandConfig.builder;
  const [ packageName ] = builder.split(':', 2);
  const pkgPath = path.join(directoryPath, 'node_modules', packageName);
  const kitJson = require(path.join(pkgPath, 'devkit.json'));
  const { implementation, description } = kitJson.builders[command];

  if (Array.isArray(implementation)) {
    ctx.commander.register(command, description, async () => {
      for (let i = 0; i < implementation.length; i ++) {
        const action = path.join(pkgPath, implementation[i]);
        await require(action)(ctx);
      }
    });
  } else {
    const action = path.join(pkgPath, implementation);
    ctx.commander.register(command, description, () => {
      require(action)(ctx);
    });
  }
};

export default function loadDevkits(ctx: any): Promise<void> {
  const config = new Config(ctx);
  const configData = config.loadConfig();
  const directoryPath = config.getConfigDirectory();

  return new Promise<any>((resolve, reject) => {
    if (configData) {
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