import shell from 'shelljs';
import chai from 'chai';

const { expect } = chai;

describe('@feflow/core - Native list', () => {
  beforeEach(() => {
    shell.exec('rm -rf .fef');
  });

  it.only('未安装任何脚手架或插件时, fef list 应提示未安装任何脚手架或插件', () => {
    const expectContent =
      'You can search more templates or plugins through https://feflowjs.com/encology/\nNo templates and plugins have been installed\n';
    console.log('E2E: fef list === ', shell.exec(`node bin/feflow list --e2e`).stdout);
    expect(shell.exec(`node bin/feflow list --e2e`).stdout).to.equal(expectContent);
  });

  it('安装 @feflow/generator-example 脚手架后, fef list 的返回内容应包含 @feflow/generator-example', () => {
    // 安装 @feflow/generator-example
    const packageName = '@feflow/generator-example';
    const edition = '0.0.7';
    shell.exec(`node bin/feflow install ${packageName}@${edition} --e2e`);

    const expectContent = `You can search more templates or plugins through https://feflowjs.com/encology/\ntemplates\n${packageName}(${edition})\nplugins\nNo plugins have been installed\n`;
    expect(shell.exec(`node bin/feflow list --e2e`).stdout).to.equal(expectContent);
  });

  it('安装 feflow-plugin-lint 插件后, fef list 的返回内容应包含 feflow-plugin-lint', () => {
    // 安装 feflow-plugin-lint
    const packageName = 'feflow-plugin-lint';
    const edition = '1.1.3';
    shell.exec(`node bin/feflow install ${packageName}@${edition} --e2e`);

    const expectContent = `You can search more templates or plugins through https://feflowjs.com/encology/\ntemplates\nNo templates have been installed\nplugins\n${packageName}(${edition})\n`;
    expect(shell.exec(`node bin/feflow list --e2e`).stdout).to.equal(expectContent);
  });
});
