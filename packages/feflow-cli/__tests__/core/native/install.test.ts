import shell from 'shelljs';
import chai from 'chai';

const { expect, assert } = chai;

describe.only('@feflow/core - Native list', () => {
  beforeEach(() => {
    shell.exec('rm -rf .fef');
  });

  it('fef install 后面的参数为空时返回参数错误的提示信息', () => {
    const expectContent = '[ Feflow Error ][ feflow-cli ] parameter error\n';
    expect(shell.exec(`node bin/feflow install`).stderr).to.equal(expectContent);
  });

  it('fef install 安装不存在的包时应返回安装错误的提示信息', () => {
    const nonexistentPackage = 'nonexistent-package';
    const expectPattern = /install error/;
    const stdErr = shell.exec(`node bin/feflow install ${nonexistentPackage}`).stderr;
    assert(expectPattern.test(stdErr));
  });

  it('fef install 安装脚手架成功时,fef list 的返回信息中应包含该脚手架', () => {
    const packageName = '@feflow/generator-example';
    const edition = '0.0.7';
    shell.exec(`node bin/feflow install ${packageName}@${edition}`);

    const expectContent = `You can search more templates or plugins through https://feflowjs.com/encology/\ntemplates\n${packageName}(${edition})\nplugins\nNo plugins have been installed\n`;
    expect(shell.exec(`node bin/feflow list`).stdout).to.equal(expectContent);
  });

  it('fef install 安装插件成功时, fef list 的返回信息中应包含该插件', () => {
    const packageName = 'feflow-plugin-lint';
    const edition = '1.1.3';
    shell.exec(`node bin/feflow install ${packageName}@${edition}`);

    const expectContent = `You can search more templates or plugins through https://feflowjs.com/encology/\ntemplates\nNo templates have been installed\nplugins\n${packageName}(${edition})\n`;
    expect(shell.exec(`node bin/feflow list`).stdout).to.equal(expectContent);
  });
});
