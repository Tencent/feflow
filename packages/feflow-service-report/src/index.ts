import Api from './api';
import {
  getUserNameFromGit,
  getSystemInfoByOS,
  getProjectByPackage
} from './common/utils';
import Hanzo from './common/hanzo';

interface ReportContext {
  base: String; // pathFn.join(osenv.home(), './.feflow');
  rcPath: String; // pathFn.join(base, '.feflowrc.yml');
  version: String; // pkg.version;
  baseDir: String; // base + sep;
  pkgPath: String; // pathFn.join(base, 'package.json');
  pluginDir: String; // pathFn.join(base, 'node_modules') + sep;
  logDir: String; // pathFn.join(base, 'logs');
  args: String; // camelizeKeys(args);
  config: String; // utils.parseYaml(rcPath);            // Read feflow local config.
  pwd: String;
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

    this.userName = this.getUserName();
    this.systemInfo = this.getSystemInfo();
    this.project = this.getProject();
  }
  get timestamp() {
    return Date.now();
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

  cmdStart() {
    this.timestampCmdStart = this.timestamp;
  }

  cmdEnd() {
    // 计时较为粗糙
    this.timestampSpenTime = this.timestamp - this.timestampCmdStart;
  }

  getReportBody(cmd, args): ReportBody {
    const reportBody: ReportBody = Hanzo.create()
      .load('command', cmd)
      .load('user_name', this.userName)
      .load('params', args)
      .load('system_info', this.systemInfo)
      .load('project', this.project)
      // .load("spent_time", this.systemInfo)
      // .load("is_fail", this.systemInfo)
      .done();

    return reportBody;
  }

  checkBeforeReport(cmd, args) {
    if (!cmd) {
      return false;
    }
    return true;
  }

  report(cmd, args?) {
    // 命令校验
    if (!this.checkBeforeReport(cmd, args)) return;

    const reportBody: ReportBody = this.getReportBody(cmd, args);

    Api.report(reportBody);
  }
}

module.exports = Report;
