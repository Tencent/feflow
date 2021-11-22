import fs from 'fs';
import path from 'path';
import importFresh from 'import-fresh';
import stripComments from 'strip-json-comments';
import yaml from 'js-yaml';
import Feflow from '@/core';

import { PROJECT_CONFIG, DEVKIT_CONFIG } from '../../shared/constant';

export default class Config {
  public ctx: Feflow;
  constructor(ctx: Feflow) {
    this.ctx = ctx;
  }

  getProjectDirectory(): string {
    let currDir: string = process.cwd();

    const isConfigExits = () => {
      for (const filename of PROJECT_CONFIG) {
        if (fs.existsSync(path.join(currDir, filename))) {
          return true;
        }
      }
      return false;
    };

    while (!isConfigExits()) {
      currDir = path.join(currDir, '../');
      if (currDir === '/' || /^[a-zA-Z]:\\$/.test(currDir)) {
        return '';
      }
    }

    return currDir;
  }

  loadProjectConfig() {
    const directoryPath = this.getProjectDirectory();
    return this.loadConfig(directoryPath, PROJECT_CONFIG);
  }

  loadDevkitConfig(directoryPath: string) {
    return this.loadConfig(directoryPath, DEVKIT_CONFIG);
  }

  loadConfig(directoryPath: string, configArray: Array<string>) {
    for (const filename of configArray) {
      const filePath = path.join(directoryPath, filename);
      if (fs.existsSync(filePath)) {
        let configData;

        try {
          configData = this.loadConfigFile(filePath);
        } catch (error) {
          if (!(error instanceof FeflowConfigFieldNotFoundError)) {
            throw error;
          }
        }

        if (configData) {
          this.ctx.logger.debug('Config file found', filePath);
          this.ctx.logger.debug('Config data', configData);

          return configData;
        }
      }
    }

    this.ctx.logger.debug('Config file not found.');
    return null;
  }

  loadConfigFile(filePath: string) {
    switch (path.extname(filePath)) {
      case '.js':
        return this.loadJSConfigFile(filePath);

      case '.json':
        if (path.basename(filePath) === 'package.json') {
          return this.loadPackageJSONConfigFile(filePath);
        }
        return this.loadJSONConfigFile(filePath);

      case '.yaml':
      case '.yml':
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
      e instanceof Error && (e.message = `Cannot read config file: ${filePath}\nError: ${e.message}`);
      throw e;
    }
  }

  loadYAMLConfigFile(filePath: string) {
    this.ctx.logger.debug(`Loading YAML config file: ${filePath}`);
    try {
      return yaml.safeLoad(this.readFile(filePath)) || {};
    } catch (e) {
      this.ctx.logger.debug(`Error reading YAML file: ${filePath}`);
      e instanceof Error && (e.message = `Cannot read config file: ${filePath}\nError: ${e.message}`);
      throw e;
    }
  }

  loadPackageJSONConfigFile(filePath: string) {
    this.ctx.logger.debug(`Loading package.json config file: ${filePath}`);

    let packageData;
    try {
      packageData = this.loadJSONConfigFile(filePath);
    } catch (e) {
      this.ctx.logger.debug(`Error reading package.json file: ${filePath}`);
      e instanceof Error && (e.message = `Cannot read config file: ${filePath}\nError: ${e.message}`);
      throw e;
    }

    if (!Object.hasOwnProperty.call(packageData, 'feflowConfig')) {
      throw new FeflowConfigFieldNotFoundError("package.json file doesn't have 'feflowConfig' field.");
    }

    return packageData.feflowConfig;
  }

  loadJSONConfigFile(filePath: string) {
    this.ctx.logger.debug(`Loading JSON config file: ${filePath}`);

    try {
      return JSON.parse(stripComments(this.readFile(filePath)));
    } catch (e) {
      this.ctx.logger.debug(`Error reading JSON file: ${filePath}`);
      e instanceof Error && (e.message = `Cannot read config file: ${filePath}\nError: ${e.message}`);
      throw e;
    }
  }

  loadLegacyConfigFile(filePath: string) {
    this.ctx.logger.debug(`Loading legacy config file: ${filePath}`);
    try {
      return yaml.safeLoad(stripComments(this.readFile(filePath))) || {};
    } catch (e) {
      this.ctx.logger.debug('Error reading YAML file: %s\n%o', filePath, e);
      e instanceof Error && (e.message = `Cannot read config file: ${filePath}\nError: ${e.message}`);
      throw e;
    }
  }

  readFile(filePath: string) {
    return fs.readFileSync(filePath, 'utf8').replace(/^\ufeff/u, '');
  }
}

class FeflowConfigFieldNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FeflowConfigFieldNotFoundError';
  }
}
