import Api from './api';
import {
  getUserNameFromGit,
  getSystemInfoByOS,
  getProjectByPackage
} from './common/utils';
import objectFactory from './common/objectFactory';

interface ReportContext {
  log: any;
  logger: any;
  pkgConfig: {
    name: string;
  };
}

interface ReportBody {
  [key: string]: any;
}

class Report {
  ctx: ReportContext;
  timestampSpenTime: number;
  timestampCmdStart: number;
  userName: string;
  systemInfo: string;
  project: string;

  constructor(feflowContext: any) {
    this.ctx = feflowContext;

    this.loadContextLogger();
    this.userName = this.getUserName();
    this.systemInfo = this.getSystemInfo();
    this.project = this.getProject();
  }
  loadContextLogger() {
    this.ctx.log = this.ctx.log || this.ctx.logger;
    this.ctx.log = this.ctx.log
      ? this.ctx.log
      : { info: console.log, debug: console.log };
  }
  getProject() {
    const { pkgConfig } = this.ctx;
    let project = '';

    if (pkgConfig) {
      // feflow context
      project = pkgConfig.name;
    } else {
      // if not, read project name from project's package.json
      project = getProjectByPackage();
    }

    return project;
  }
  getUserName() {
    return getUserNameFromGit();
  }

  getSystemInfo(): string {
    const systemDetailInfo = getSystemInfoByOS();
    return JSON.stringify(systemDetailInfo);
  }

  getReportBody(cmd, args): ReportBody {
    const reportBody: ReportBody = objectFactory
      .create()
      .load('command', cmd)
      .load('user_name', this.userName)
      .load('params', args)
      .load('system_info', this.systemInfo)
      .load('project', this.project)
      .done();

    return reportBody;
  }

  checkBeforeReport(cmd, args) {
    return !!cmd;
  }

  report(cmd, args?) {
    // args check
    if (!this.checkBeforeReport(cmd, args)) return;
    try {
      const reportBody: ReportBody = this.getReportBody(cmd, args);
      this.ctx.log.debug('reportBody', reportBody);
      Api.report(reportBody, this.ctx.log);
    } catch (error) {
      this.ctx.log.debug('feflow 上报报错，请联系相关负责人排查 ', error);
    }
  }
}

module.exports = Report;
