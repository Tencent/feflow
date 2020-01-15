import chai from 'chai';
const Report = require('../src/index');

const expect = chai.expect;

describe('@feflow/report - report', () => {
  let report;

  before(() => {
    report = new Report({});
  });

  it('getProject() - get project name from package.json', () => {
    const projectName = report.getProject();

    expect(projectName).to.not.empty;
    expect(projectName).to.be.eq('@feflow/report');
  });

  it('getUserName() - username is not empty', () => {
    const username = report.getUserName();

    expect(username).to.not.empty;
  });

  it('getSystemInfo() - get system info, and is not empty', () => {
    const systemInfoStr = report.getSystemInfo();
    const info = JSON.parse(systemInfoStr);
    expect(systemInfoStr).to.not.empty;
    expect(info).to.not.empty;
    expect(info.hostname).to.not.empty;
    expect(info.type).to.not.empty;
    expect(info.platform).to.not.empty;
    expect(info.arch).to.not.empty;
    expect(info.release).to.not.empty;
  });

  it('getReportBody() ', () => {
    const body = report.getReportBody('install', 'time/builder');

    expect(body).to.not.empty;
    expect(body.command).to.eq('install');
    expect(body.user_name).to.not.empty;
    expect(body.params).to.eq('time/builder');
    expect(body.system_info).to.not.empty;
    expect(body.project).to.eq('@feflow/report');
  });

  after(() => {
    report = null;
  });
});
