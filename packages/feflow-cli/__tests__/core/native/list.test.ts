import shell from 'shelljs';
import chai from 'chai';

const { expect } = chai;

describe('@feflow/core - Native list', () => {
  afterEach(() => {
    shell.exec('rm -rf .fef');
  });

  it('测试 fef list', () => {
    // 安装 lodash.sum
    const packageName = '@feflow/generator-example';
    const edition = '0.0.7';
    shell.exec(`node bin/feflow install ${packageName}@${edition} --e2e`);

    const expectContent = `You can search more templates or plugins through https://feflowjs.com/encology/\ntemplates\n${packageName}(${edition})\nplugins\nNo plugins have been installed\n`;
    expect(shell.exec(`node bin/feflow list --e2e`).stdout).to.equal(expectContent);
  });
});
