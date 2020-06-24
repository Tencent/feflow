import chai from 'chai';
const { httpRegex, sshRegex, getProjectByGit } = require('../src/common/utils');

const expect = chai.expect;

const remoteUrlMap = {
  http: { valid: 'https://github.com/Tencent/feflow.git', invalid: 'https:github.com/Tencent/feflow.git' },
  ssh: { valid: 'git@github.com:Tencent/feflow.git', invalid: 'github.com:Tencent/feflow.git' },
};

describe('@feflow/report - utils', () => {
  it('httpRegex valid', () => {
    expect(httpRegex.test(remoteUrlMap.http.valid)).to.be.true;
  });

  it('httpRegex invalid', () => {
    expect(httpRegex.test(remoteUrlMap.http.invalid)).to.be.false;
    expect(httpRegex.test(remoteUrlMap.ssh.invalid)).to.be.false;
  });

  it('sshRegex valid', () => {
    expect(sshRegex.test(remoteUrlMap.ssh.valid)).to.be.true;
  });

  it('sshRegex invalid', () => {
    expect(sshRegex.test(remoteUrlMap.ssh.invalid)).to.be.false;
    expect(sshRegex.test(remoteUrlMap.http.invalid)).to.be.false;
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
