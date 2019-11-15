import path from "path";
import Config from "./config";

const resolveBuilder = (builderStr: string) => {
  const [packageName, builderName] = builderStr.split(":", 2);
  if (!builderName) {
    throw new Error("No builder name specified.");
  }
};

export const getDivkitConifgInfo = (
  ctx: FeflowInterface,
  configPath?: string
) => {
  const config = new Config(ctx);
  const configData: DevkitConfig = config.loadConfig(
    configPath
  ) as DevkitConfig;
  const directoryPath = config.getConfigDirectory(configPath);
  return {
    configData,
    directoryPath
  };
};

export const getKitJson = (directoryPath: string, builderStr: string) => {
  const [packageName, builderName] = builderStr.split(":", 2);
  const pkgPath = path.join(directoryPath, "node_modules", packageName);
  const kitJson = require(path.join(pkgPath, "devkit.json"));
  return { kitJson, pkgPath };
};

export default function loadDevkits(ctx: FeflowInterface, configPath?: string) {
  // get devkit config and file path
  const { configData, directoryPath } = getDivkitConifgInfo(ctx, configPath);

  if (configData) {
    const devkit: DevKit = configData.devkit as DevKit;
    ctx.projectConfig = configData;

    for (const cmd in devkit.commands) {
      const builderStr = devkit.commands[cmd].builder;
      // get project kit config
      const { kitJson, pkgPath } = getKitJson(directoryPath, builderStr);
      const { implementation, description  } = kitJson.builders[cmd];

      const handler = path.join(pkgPath, implementation);

      ctx.commander.register(cmd, description, require(handler));
    }
  } else {
  }
}
