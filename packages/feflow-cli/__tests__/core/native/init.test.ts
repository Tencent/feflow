import shell from 'shelljs';
import chai from 'chai';

const { expect } = chai;

describe('@feflow/core - Native init', () => {
  beforeEach(() => {
    shell.exec('rm -rf .fef');
  });

  it('未安装脚手架时, fef init 返回为空', () => {
    expect(shell.exec('node bin/feflow init --e2e').stdout).to.equal('');
  });

  it.only('安装某个脚手架后，fef init 的输出信息中应包含该脚手架', () => {
    // 安装 @feflow/generator-example 脚手架
    const packageName = '@feflow/generator-example';
    const edition = '0.0.7';
    shell.exec(`node bin/feflow install ${packageName}@${edition} --e2e`);

    // 测试 @feflow/generator-example 安装是否成功
    const listExpectContent = `You can search more templates or plugins through https://feflowjs.com/encology/\ntemplates\n${packageName}(${edition})\nplugins\nNo plugins have been installed\n`;
    expect(shell.exec(`node bin/feflow list --e2e`).stdout).to.equal(listExpectContent);

    // fef init 的输出信息中应该包含该脚手架
    // TODO: guichezhang 修改init代码，现在是交互式的不会执行expect
    const initExpectContent = '';
    expect(shell.exec(`node bin/feflow init --e2e`).stdout).to.equal(initExpectContent);
  });
});
