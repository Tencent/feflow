import { existsSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';
import { get } from 'lodash';

import Feflow from '../core';
import { Config } from './file';
import CommandPicker, { CommandType } from '../core/command-picker';

type PrintError = {
  error: unknown | Error;
  msg?: string;
  pluginPath?: string;
  hideError?: boolean;
};

// 不用强制中断流程
export class FefError {
  context: Feflow;
  picker: CommandPicker | null;

  defaultDocs = 'https://github.com/Tencent/feflow/issues';
  docsPathList = ['docs', 'doc', 'bugs.url', 'repository.url'];
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
      context.logger.debug('command picker is not initialized');
    }
  }

  checkPick() {
    if (this.picker) return true;
    if (this.context.commandPick) {
      this.picker = this.context.commandPick;
    }
    return !!this.picker;
  }

  printError(obj: PrintError) {
    const { pluginPath } = obj;
    if (!pluginPath) {
      if (!this.checkPick()) {
        this.context.logger.debug('无法找到命令路径');
      } else {
        this.context.logger.debug('FefError command picker 初始化成功');
      }
    }

    const docs = this.getDocPath(pluginPath);
    const { type: cmdType } = this.picker?.getCmdInfo() || { type: CommandType.PLUGIN_TYPE };
    if (docs) {
      this.printErrorWithDocs(obj, docs);
    } else {
      const { error } = obj;
      let { msg } = obj;
      if (!obj.hideError) {
        msg = `${msg || error}`;
        this.context.logger[
          [CommandType.UNIVERSAL_PLUGIN_TYPE, CommandType.UNKNOWN_TYPE].includes(cmdType) ? 'debug' : 'error'
        ]({ err: error }, msg, chalk.magenta(`${error}`));
      } else if (msg) {
        // 兼容多语言插件
        this.context.logger.info(`${msg}`);
      }
    }
  }

  printErrorWithDocs(obj: PrintError, docs: string) {
    const { error } = obj;
    let { msg } = obj;
    if (!obj.hideError) {
      msg = `${msg || error}
      插件执行发生异常，请查看文档获取更多内容：${chalk.green(docs)}`;
      this.context.logger.error({ err: error }, msg, chalk.magenta(`${error}`));
    } else {
      // 兼容多语言插件
      msg = `${msg} 请查看文档获取更多内容：${chalk.green(docs)}`;
      this.context.logger.info(msg);
    }
  }

  getDocPath(pluginPath?: string) {
    let docs = '';
    let configPath = '';
    let type = CommandType.PLUGIN_TYPE;
    let finalPluginPath = '';
    if (!pluginPath) {
      if (this.picker !== null) {
        const { path, type: cmdType } = this.picker.getCmdInfo();
        finalPluginPath = path;
        type = cmdType;
      } else {
        return docs;
      }
    }

    if (!existsSync(finalPluginPath)) {
      return docs;
    }
    if (type === CommandType.PLUGIN_TYPE) {
      configPath = join(finalPluginPath, this.pluginFile);
    } else if (type === CommandType.UNIVERSAL_PLUGIN_TYPE) {
      this.unversalpluginFile.forEach((ext) => {
        const tmpPath = join(finalPluginPath, ext);
        if (existsSync(tmpPath)) configPath = tmpPath;
      });
    } else if (type === CommandType.NATIVE_TYPE) {
      return this.defaultDocs;
    }

    if (existsSync(configPath)) {
      const config = this.parseConfig(configPath);
      this.docsPathList.forEach((docsPath) => {
        if (docs) return;
        docs = get(config, docsPath);
      });
    } else {
      this.context.logger.debug(`未找到插件配置文件: ${finalPluginPath}`);
    }

    return docs;
  }

  parseConfig(filePath: string) {
    return Config.loadConfigFile(filePath);
  }
}
