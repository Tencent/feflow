import path from 'path';

const resolveBuilder = (builderStr: string) => {
  const [packageName, builderName] = builderStr.split(':', 2);
  if (!builderName) {
    throw new Error('No builder name specified.');
  }
}

export function loadDevKit(configData: any) {
  console.log('config data-', configData);

  const devkit = configData.devkit;

  return (ctx: any) => {
    for (const cmd in devkit) {
      const builderStr = devkit[cmd].builder;
      const [packageName, builderName] = builderStr.split(':', 2);
      const pkgPath = path.join(process.cwd(), 'node_modules', packageName);
      const kitJson = require(path.join(pkgPath, 'devkit.json'));

      console.log('kitJson', kitJson);
      const implementation = kitJson.builders[cmd].implementation;
      console.log('implementation=', implementation);

      const handler = path.join(pkgPath, implementation);

      ctx.commander.register(cmd, 'desc', require(handler));
    }
  };
}

