import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { HOOK_TYPE_BEFORE, HOOK_TYPE_AFTER, REPORT_JSON, REPORT_COMMAND_ERR } from './constants';
import { getProject, getKeyFormFile, setKeyToFile } from './common/utils';

const reportProcess = path.join(__dirname, './report');

class Report {
  ctx: ReportContext;
  cmd: string;
  args: object;
  commandSource: string;
  lastCommand: string;
  project: string;
  generatorProject: string;
  startTime: number;
  costTime: number;
  cachePath: string;
  cacheData: string;

  constructor(feflowContext: ReportContext, cmd?: string, args?: any) {
    this.ctx = feflowContext;
    this.cmd = cmd;
    this.args = args;
    this.cachePath = path.join(this.ctx.root, REPORT_JSON);
    this.project = getProject(this.ctx);
    this.loadContextLogger();
  }

  // register before/after hook event
  private registerHook(): any {
    this.ctx.hook.on(HOOK_TYPE_BEFORE, this.reportOnHookBefore);
    // report some performance data after command executed
    this.ctx.hook.on(HOOK_TYPE_AFTER, this.reportOnHookAfter);
  }

  private loadContextLogger(): any {
    this.ctx.log = this.ctx.log || this.ctx.logger;
    this.ctx.log = this.ctx.log ? this.ctx.log : { info: console.log, debug: console.log };
  }

  private reportOnHookBefore = (): any => {
    const { cmd, args } = this;
    let commandWithoutVersion;
    try {
      commandWithoutVersion = cmd?.split('@')[0];
    } catch (error) {
      this.ctx.log.debug(`reportOnHookBefore: command parse error: ${error}`);
      commandWithoutVersion = '';
    }
    const store = this.ctx.commander?.store[commandWithoutVersion] || this.ctx.commander?.store[cmd] || {};
    this.commandSource = store?.pluginName || this.commandSource;
    if (!this.commandSource && typeof store.options === 'string') {
      this.commandSource = store.options;
    }
    this.ctx.log.debug('HOOK_TYPE_BEFORE');
    this.startTime = Date.now();
    this.report(cmd, args);
  };

  private reportOnHookAfter = (): any => {
    this.ctx.log.debug('HOOK_TYPE_AFTER');
    this.costTime = Date.now() - this.startTime;
    this.report(this.cmd, this.args, true);
  };

  private checkBeforeReport = (cmd: string): any => {
    if (this.cmd && this.cmd !== cmd) {
      this.lastCommand = this.cmd;
    }
    this.cmd = cmd;
    return !!cmd;
  };

  setCommandSource(commandSource: string): any {
    this.commandSource = commandSource;
  }

  init(cmd: string): any {
    this.cmd = cmd;
    this.args = this.ctx.args;
    // hook is not supported in feflow 0.16.x
    if (this.ctx.hook) {
      this.registerHook();
    }

    // 需要一个文件来存状态数据，init 的时候保证为空，存reCallId、hasRecalled、isRecallActivating、errMsg
    if (this.cacheData && fs.existsSync(this.cachePath)) {
      fs.writeFileSync(this.cachePath, '{}', 'utf-8');
    }
    // 文件不存在则创建
    fs.open(this.cachePath, 'w+', err => {
      if (err) return this.ctx.log.debug(`${this.cachePath} 打开失败 => ${err}`);
      fs.writeFileSync(this.cachePath, '{}', 'utf-8');
    });
  }

  report(cmd: string, args?, recall?): any {
    // args check
    if (!this.checkBeforeReport(cmd)) return;

    const child = spawn(process.argv[0], [reportProcess], {
      detached: true,
      stdio: 'ignore',
      env: {
        ...process.env,
        cmd,
        args: JSON.stringify(args),
        commandSource: this.commandSource,
        lastCommand: this.lastCommand,
        project: this.project,
        version: this.ctx.version,
        cachePath: this.cachePath,
        costTime: String(this.costTime),
        recall,
      },
      windowsHide: true,
    });

    // 父进程不会等待子进程
    child.unref();
  }

  reportInitResult(): any {
    const { cmd } = this;
    if (cmd !== 'init') {
      return;
    }
    this.costTime = Date.now() - this.startTime;
    this.generatorProject = getProject(this.ctx, true);
    this.report(this.cmd, this.args, true);
  }

  reportCommandError(err: Error): any {
    if (!err) {
      return;
    }
    setKeyToFile(this.cachePath, 'errMsg', err.message);
    if (getKeyFormFile(this.cachePath, 'reCallId') && !getKeyFormFile(this.cachePath, 'hasRecalled')) {
      this.report(this.cmd, this.args, true);
    } else {
      this.report(REPORT_COMMAND_ERR);
    }
  }
}

module.exports = Report;
