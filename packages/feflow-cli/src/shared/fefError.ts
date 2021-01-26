import { existsSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
import { get } from 'lodash';

import Feflow from '../core';
import CommandPicker, { COMMAND_TYPE } from '../core/command-picker';
import { Config } from '../shared/file';

// 不用强制中断流程
export class FefError {
  context: Feflow;
  picker: CommandPicker | null;

  docsPath = ['docs', 'bugs.url', 'repository.url'];
  pluginFile = 'package.json';
  unversalpluginFile = ['plugin.yaml', 'plugin.yml'];

  constructor(context: Feflow) {
    this.context = context;
    // 区分npm插件和多语言插件
    // npm插件 => package.json
    // 多语言插件 => plugin.yaml
    if (this.context.commandPick) {
      this.picker = context.commandPick as CommandPicker;
    } else {
      this.picker = null;
      // throw new Error('command pick is not inital');
      context.logger.debug('command pick is not inital');
    }
  }

  checkPick() {
    if (this.picker) return true;
    if (this.context.commandPick) {
      this.picker = this.context.commandPick as CommandPicker;
    }
    return !!this.picker;
  }

  printError(error: any, msg?: string) {
    if (!this.checkPick()) {
      return this.context.logger.error(
        { err: error },
        msg || '插件或者内部发生异常',
        chalk.magenta(error)
      );
    }

    msg = msg ? msg : error;
    let errMsg = msg;
    const docs = this.getDocPath();
    if (docs) {
      errMsg = `${msg} 
      插件执行发生异常，请查看文档获取更多内容：${chalk.green(docs)}`;
    }

    this.context.logger.error({ err: error }, errMsg, chalk.magenta(error));
  }

  getDocPath() {
    let docs = '';
    let configPath = '';
    if (this.picker == null) return docs;

    const { path, type } = this.picker.getCmdInfo();
    if (!existsSync(path)) {
      return docs;
    }
    if (type === COMMAND_TYPE.PLUGIN_TYPE) {
      configPath = join(path, this.pluginFile);
    } else if (type === COMMAND_TYPE.UNIVERSAL_PLUGIN_TYPE) {
      this.unversalpluginFile.forEach((ext) => {
        let tmpPath = join(path, ext);
        if (existsSync(tmpPath)) configPath = tmpPath;
      });
    }
    if (existsSync(configPath)) {
      const config = this.parseConfig(configPath);
      this.docsPath.forEach((path) => {
        if (docs) return;
        docs = get(config, path);
      });
    } else {
      this.context.logger.debug(`未找到插件配置文件: ${path}`);
    }

    return docs;
  }

  parseConfig(filePath: string) {
    return Config.loadConfigFile(filePath);
  }
}
