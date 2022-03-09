import shell from 'shelljs';
import chai from 'chai';

const { expect } = chai;

describe('@feflow/core - Native list', () => {
  beforeEach(() => {
    shell.exec('rm -rf .fef');
  });

  it('测试 fef install 后面的参数为空', () => {
    // 安装 @feflow/generator-example
    const packageName = '@feflow/generator-example';
    const edition = '0.0.7';
    shell.exec(`node bin/feflow install ${packageName}@${edition} --e2e`);

    const expectContent = `You can search more templates or plugins through https://feflowjs.com/encology/\ntemplates\n${packageName}(${edition})\nplugins\nNo plugins have been installed\n`;
    expect(shell.exec(`node bin/feflow list --e2e`).stdout).to.equal(expectContent);
  });

  // it('测试 fef install 安装脚手架', () => {
  //   // 安装 @feflow/generator-example
  //   const packageName = '@feflow/generator-example';
  //   const edition = '0.0.7';
  //   shell.exec(`node bin/feflow install ${packageName}@${edition} --e2e`);

  //   const expectContent = `You can search more templates or plugins through https://feflowjs.com/encology/\ntemplates\n${packageName}(${edition})\nplugins\nNo plugins have been installed\n`;
  //   expect(shell.exec(`node bin/feflow list --e2e`).stdout).to.equal(expectContent);
  // });

  // it('测试 fef install 安装插件', () => {
  //   // 安装 @feflow/generator-example
  //   const packageName = '@feflow/generator-example';
  //   const edition = '0.0.7';
  //   shell.exec(`node bin/feflow install ${packageName}@${edition} --e2e`);

  //   const expectContent = `You can search more templates or plugins through https://feflowjs.com/encology/\ntemplates\n${packageName}(${edition})\nplugins\nNo plugins have been installed\n`;
  //   expect(shell.exec(`node bin/feflow list --e2e`).stdout).to.equal(expectContent);
  // });
});
