import chai from 'chai';
import { httpRegex, sshRegex, getProjectByGit, getGitStatus, getSystemInfo } from '../src/common/utils'; // to-do: 把src改成lib后执行

const { expect } = chai;

const remoteUrlMap = {
  http: { valid: 'https://github.com/Tencent/feflow.git', invalid: 'https:github.com/Tencent/feflow.git' },
  ssh: { valid: 'git@github.com:Tencent/feflow.git', invalid: 'github.com:Tencent/feflow.git' },
};

describe('@feflow/report - utils', () => {
  it('httpRegex valid', () => {
    expect(httpRegex.test(remoteUrlMap.http.valid)).to.be.equal(true);
  });

  it('getSystemInfo() - get system info, and is not empty', () => {
    const systemInfoStr = getSystemInfo();
    const info = JSON.parse(systemInfoStr);
    expect(systemInfoStr).to.be.not.equal(null);
    expect(info).to.be.not.equal(null);
    expect(info.hostname).to.be.not.equal(null);
    expect(info.type).to.be.not.equal(null);
    expect(info.platform).to.be.not.equal(null);
    expect(info.arch).to.be.not.equal(null);
    expect(info.release).to.be.not.equal(null);
  });

  it('httpRegex invalid', () => {
    expect(httpRegex.test(remoteUrlMap.http.invalid)).to.be.equal(false);
    expect(httpRegex.test(remoteUrlMap.ssh.invalid)).to.be.equal(false);
  });

  it('sshRegex valid', () => {
    expect(sshRegex.test(remoteUrlMap.ssh.valid)).to.be.equal(true);
  });

  it('sshRegex invalid', () => {
    expect(sshRegex.test(remoteUrlMap.ssh.invalid)).to.be.equal(false);
    expect(sshRegex.test(remoteUrlMap.http.invalid)).to.be.equal(false);
  });

  it('getGitStatus work', () => {
    expect(getGitStatus()).to.be.equal(false);
  });

  it('getProjectByGit http valid', () => {
    expect(getProjectByGit(remoteUrlMap.http.valid)).to.be.equal('Tencent/feflow');
  });

  it('getProjectByGit ssh valid', () => {
    expect(getProjectByGit(remoteUrlMap.ssh.valid)).to.be.equal('Tencent/feflow');
  });

  it('when given invalid http url, then getProjectByGit should be ""', () => {
    expect(getProjectByGit(remoteUrlMap.http.invalid)).to.be.equal('');
  });

  it('when given invalid ssh url, then getProjectByGit should be ""', () => {
    expect(getProjectByGit(remoteUrlMap.ssh.invalid)).to.be.equal('');
  });
});
