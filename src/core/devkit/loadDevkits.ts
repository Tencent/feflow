import path from 'path';
import Config from './config';

const resolveBuilder = (builderStr: string) => {
  const [packageName, builderName] = builderStr.split(':', 2);
  if (!builderName) {
    throw new Error('No builder name specified.');
  }
}

export default function loadDevkits(ctx: any) {
  const config = new Config(ctx);
  const configData = config.loadConfig();
  const directoryPath = config.getConfigDirectory();
  if (configData) {
    const devkit = configData.devkit;
    ctx.projectConfig = configData;
    for (const cmd in devkit.commands) {
      const builderStr = devkit.commands[cmd].builder;
      const [packageName, builderName] = builderStr.split(':', 2);
      const pkgPath = path.join(directoryPath, 'node_modules', packageName);
      const kitJson = require(path.join(pkgPath, 'devkit.json'));
      const implementation = kitJson.builders[cmd].implementation;
      const description = kitJson.builders[cmd].description;
      const handler = path.join(pkgPath, implementation);
      ctx.commander.register(cmd, description, require(handler));
    }
  } else {

  }
}

