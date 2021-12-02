import chai from 'chai';
import { httpRegex, sshRegex, getProjectByGit, getGitStatus, getSystemInfo } from '../src/common/utils'; // to-do: 把src改成lib后执行

const { expect } = chai;

const remoteUrlMap = {
  http: { valid: 'https://github.com/Tencent/feflow.git', invalid: 'https:github.com/Tencent/feflow.git' },
  ssh: { valid: 'git@github.com:Tencent/feflow.git', invalid: 'github.com:Tencent/feflow.git' },
};

describe('@feflow/report - utils', function () {
  it('httpRegex valid', function () {
    expect(httpRegex.test(remoteUrlMap.http.valid)).to.equal(true);
  });

  it('getSystemInfo() - get system info, and is not empty', function () {
    const systemInfoStr = getSystemInfo();
    const info = JSON.parse(systemInfoStr);
    expect(systemInfoStr).to.not.empty;
    expect(info).to.not.empty;
    expect(info.hostname).to.not.empty;
    expect(info.type).to.not.empty;
    expect(info.platform).to.not.empty;
    expect(info.arch).to.not.empty;
    expect(info.release).to.not.empty;
  });

  it('httpRegex invalid', function () {
    expect(httpRegex.test(remoteUrlMap.http.invalid)).to.equal(false);
    expect(httpRegex.test(remoteUrlMap.ssh.invalid)).to.equal(false);
  });

  it('sshRegex valid', function () {
    expect(sshRegex.test(remoteUrlMap.ssh.valid)).to.equal(true);
  });

  it('sshRegex invalid', function () {
    expect(sshRegex.test(remoteUrlMap.ssh.invalid)).to.equal(false);
    expect(sshRegex.test(remoteUrlMap.http.invalid)).to.equal(false);
  });

  it('getGitStatus work', function () {
    expect(getGitStatus()).to.equal(false);
  });

  it('getProjectByGit http valid', function () {
    expect(getProjectByGit(remoteUrlMap.http.valid)).to.be.equal('Tencent/feflow');
  });

  it('getProjectByGit ssh valid', function () {
    expect(getProjectByGit(remoteUrlMap.ssh.valid)).to.be.equal('Tencent/feflow');
  });

  it('when given invalid http url, then getProjectByGit should be ""', function () {
    expect(getProjectByGit(remoteUrlMap.http.invalid)).to.be.equal('');
  });

  it('when given invalid ssh url, then getProjectByGit should be ""', function () {
    expect(getProjectByGit(remoteUrlMap.ssh.invalid)).to.be.equal('');
  });
});
