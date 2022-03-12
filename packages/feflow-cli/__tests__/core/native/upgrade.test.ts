import shell from 'shelljs';
import chai from 'chai';

const { expect } = chai;

describe('@feflow/core - Native upgrade', () => {
  beforeEach(() => {
    shell.exec('rm -rf .fef');
  });

  it('执行 fef upgrade 应该返回upgrade提示信息', () => {
    const expectContent = 'E2E: upgrade\n';
    expect(shell.exec('node bin/feflow upgrade --e2e').stdout).to.equal(expectContent);
  });
});
