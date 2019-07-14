import fs from 'fs';
import path from 'path';
import stripComments from 'strip-json-comments';
import yaml from 'js-yaml';
import { DEVKIT_CONFIG } from '../../shared/constant';

export default class Config {

  loadConfig() {
    const directoryPath = process.cwd();
    for (const filename of DEVKIT_CONFIG) {
      const filePath = path.join(directoryPath, filename);

      if (fs.existsSync(filePath)) {
        let configData;

        try {
          configData = this.loadConfigFile(filePath);
        } catch (error) {
          if (!error || error.code !== "FEFLOW_CONFIG_FIELD_NOT_FOUND") {
            throw error;
          }
        }

        if (configData) {
          console.log(`Config file found: ${filePath}`);
          console.log('config data', configData);

          return configData;
        }
      }
    }

    console.log(`Config file not found on ${directoryPath}`);
    return null;
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
    console.log(`Loading JS config file: ${filePath}`);
    try {

    } catch (e) {
      console.log(`Error reading JavaScript file: ${filePath}`);
      e.message = `Cannot read config file: ${filePath}\nError: ${e.message}`;
      throw e;
    }
  }

  loadYAMLConfigFile(filePath: string) {
    console.log(`Loading YAML config file: ${filePath}`);
    try {
      return yaml.safeLoad(this.readFile(filePath)) || {};
    } catch (e) {
      console.log(`Error reading YAML file: ${filePath}`);
      e.message = `Cannot read config file: ${filePath}\nError: ${e.message}`;
      throw e;
    }
  }

  loadPackageJSONConfigFile(filePath: string) {
    console.log(`Loading package.json config file: ${filePath}`);
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
      console.log(`Error reading package.json file: ${filePath}`);
      e.message = `Cannot read config file: ${filePath}\nError: ${e.message}`;
      throw e;
    }
  }

  loadJSONConfigFile(filePath: string) {
    console.log(`Loading JSON config file: ${filePath}`);

    try {
      return JSON.parse(stripComments(this.readFile(filePath)));
    } catch (e) {
      console.log(`Error reading JSON file: ${filePath}`);
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
    console.log(`Loading legacy config file: ${filePath}`);
    try {
      return yaml.safeLoad(stripComments(this.readFile(filePath))) || {};
    } catch (e) {
      console.log("Error reading YAML file: %s\n%o", filePath, e);
      e.message = `Cannot read config file: ${filePath}\nError: ${e.message}`;
      throw e;
    }
  }

  readFile(filePath: string) {
    return fs.readFileSync(filePath, "utf8").replace(/^\ufeff/u, "");
  }
}