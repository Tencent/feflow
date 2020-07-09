import chai from 'chai';
const Report = require('../src/index');
const { getUserName, httpRegex, sshRegex } = require('../src/common/utils');

const expect = chai.expect;

describe('@feflow/report - report', () => {
  let report;

  before(() => {
    report = new Report({});
  });

  it('getUserName() - username is not empty', () => {
    const username = getUserName();

    expect(username).to.not.empty;
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
