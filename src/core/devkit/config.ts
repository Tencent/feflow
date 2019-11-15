import fs from "fs";
import path from "path";
import importFresh from "import-fresh";
import stripComments from "strip-json-comments";
import yaml from "js-yaml";
import { DEVKIT_CONFIG } from "../../shared/constant";

export default class Config {
  public ctx: FeflowInterface;
  constructor(ctx: FeflowInterface) {
    this.ctx = ctx;
  }

  getConfigDirectory(cwdPath?: string): string {
    let currDir: string = cwdPath ? cwdPath : process.cwd();

    const isConfigExits = () => {
      for (const filename of DEVKIT_CONFIG) {
        if (fs.existsSync(path.join(currDir, filename))) {
          return true;
        }
      }
      return false;
    };

    while (!isConfigExits()) {
      currDir = path.join(currDir, "../");
      if (currDir === "/" || /^[a-zA-Z]:\\$/.test(currDir)) {
        return "";
      }
    }

    return currDir;
  }
  loadConfig(configPath?: string): DevkitConfig | null {
    let configFilePath = "";
    for (const filename of DEVKIT_CONFIG) {
      if (fs.existsSync(filename) && !configFilePath) {
        configFilePath = filename;
      }
    }

    if (configFilePath) {
      return this.readConfig(configFilePath, configPath);
    }

    this.ctx.logger.debug(`Config file not found.`);
    return null;
  }
  readConfig(filename: string, configPath?: string) {
    const directoryPath = this.getConfigDirectory(configPath);
    const filePath = path.join(directoryPath, filename);
    let configData: DevkitConfig;

    try {
      configData = this.loadConfigFile(filePath);
    } catch (error) {
      configData = {};
      if (!error || error.code !== "FEFLOW_CONFIG_FIELD_NOT_FOUND") {
        throw error;
      }
    }

    if (configData) {
      this.ctx.logger.debug(`Config file found: ${filePath}`);
      this.ctx.logger.debug("config data", configData);
    }
    return configData;
  }
  loadConfigFile(filePath: string) {
    switch (path.extname(filePath)) {
      case ".js":
        return this.loadJSConfigFile(filePath);

      case ".json":
        if (path.basename(filePath) === "package.json") {
          return this.loadPackageJSONConfigFile(filePath);
        }
        return this.loadJSONConfigFile(filePath);

      case ".yaml":
      case ".yml":
        return this.loadYAMLConfigFile(filePath);

      default:
        return this.loadLegacyConfigFile(filePath);
    }
  }

  loadJSConfigFile(filePath: string) {
    this.ctx.logger.debug(`Loading JS config file: ${filePath}`);
    try {
      return importFresh(filePath);
    } catch (e) {
      this.ctx.logger.debug(`Error reading JavaScript file: ${filePath}`);
      e.message = `Cannot read config file: ${filePath}\nError: ${e.message}`;
      throw e;
    }
  }

  loadYAMLConfigFile(filePath: string) {
    this.ctx.logger.debug(`Loading YAML config file: ${filePath}`);
    try {
      return yaml.safeLoad(this.readFile(filePath)) || {};
    } catch (e) {
      this.ctx.logger.debug(`Error reading YAML file: ${filePath}`);
      e.message = `Cannot read config file: ${filePath}\nError: ${e.message}`;
      throw e;
    }
  }

  loadPackageJSONConfigFile(filePath: string) {
    this.ctx.logger.debug(`Loading package.json config file: ${filePath}`);
    try {
      const packageData = this.loadJSONConfigFile(filePath);

      if (!Object.hasOwnProperty.call(packageData, "feflowConfig")) {
        throw Object.assign(
          new Error("package.json file doesn't have 'feflowConfig' field."),
          { code: "FEFLOW_CONFIG_FIELD_NOT_FOUND" }
        );
      }

      return packageData.feflowConfig;
    } catch (e) {
      this.ctx.logger.debug(`Error reading package.json file: ${filePath}`);
      e.message = `Cannot read config file: ${filePath}\nError: ${e.message}`;
      throw e;
    }
  }

  loadJSONConfigFile(filePath: string) {
    this.ctx.logger.debug(`Loading JSON config file: ${filePath}`);

    try {
      return JSON.parse(stripComments(this.readFile(filePath)));
    } catch (e) {
      this.ctx.logger.debug(`Error reading JSON file: ${filePath}`);
      e.message = `Cannot read config file: ${filePath}\nError: ${e.message}`;
      e.messageTemplate = "failed-to-read-json";
      e.messageData = {
        path: filePath,
        message: e.message
      };
      throw e;
    }
  }

  loadLegacyConfigFile(filePath: string) {
    this.ctx.logger.debug(`Loading legacy config file: ${filePath}`);
    try {
      return yaml.safeLoad(stripComments(this.readFile(filePath))) || {};
    } catch (e) {
      this.ctx.logger.debug("Error reading YAML file: %s\n%o", filePath, e);
      e.message = `Cannot read config file: ${filePath}\nError: ${e.message}`;
      throw e;
    }
  }

  readFile(filePath: string) {
    return fs.readFileSync(filePath, "utf8").replace(/^\ufeff/u, "");
  }
}
