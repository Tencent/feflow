import shell from 'shelljs';
import chai from 'chai';

const { expect } = chai;

describe('@feflow/core - Native list', () => {
  beforeEach(() => {
    shell.exec('rm -rf .fef');
  });

  it('fef install 后面的参数为空时返回的信息为空，并且 fef list 的结果中不包含脚手架或插件', () => {
    expect(shell.exec(`node bin/feflow install --e2e`).stdout).to.equal('');

    const expectContent = `You can search more templates or plugins through https://feflowjs.com/encology/\nNo templates and plugins have been installed\n`;
    expect(shell.exec(`node bin/feflow list --e2e`).stdout).to.equal(expectContent);
  });

  it('fef install 安装不存在的脚手架时应返回Feflow提示信息，并且 fef list 的返回结果中不包含脚手架或插件', () => {
    const packageName = 'pkg_123654';
    expect(shell.exec(`node bin/feflow install ${packageName} --e2e`).stdout).to.equal(
      `[ Feflow Info ][ native ] Installing packages. This might take a couple of minutes.\n`,
    );

    const expectContent = `You can search more templates or plugins through https://feflowjs.com/encology/\nNo templates and plugins have been installed\n`;
    expect(shell.exec(`node bin/feflow list --e2e`).stdout).to.equal(expectContent);
  });

  it('fef install 安装脚手架时，fef list 的返回结果中应包含该脚手架', () => {
    const packageName = '@feflow/generator-example';
    const edition = '0.0.7';
    shell.exec(`node bin/feflow install ${packageName}@${edition} --e2e`);

    const expectContent = `You can search more templates or plugins through https://feflowjs.com/encology/\ntemplates\n${packageName}(${edition})\nplugins\nNo plugins have been installed\n`;
    expect(shell.exec(`node bin/feflow list --e2e`).stdout).to.equal(expectContent);
  });

  it('fef install 安装插件时，fef list 的返回结果中应包含该插件', () => {
    const packageName = 'feflow-plugin-lint';
    const edition = '1.1.3';
    shell.exec(`node bin/feflow install ${packageName}@${edition} --e2e`);

    const expectContent = `You can search more templates or plugins through https://feflowjs.com/encology/\ntemplates\nNo templates have been installed\nplugins\n${packageName}(${edition})\n`;
    expect(shell.exec(`node bin/feflow list --e2e`).stdout).to.equal(expectContent);
  });
});
