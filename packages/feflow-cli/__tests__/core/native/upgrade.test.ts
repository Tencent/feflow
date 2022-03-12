import shell from 'shelljs';
import chai from 'chai';

const { expect } = chai;

describe('@feflow/core - Native upgrade', () => {
  beforeEach(() => {
    shell.exec('rm -rf .fef');
  });

  it('fef info 的输出中应该包含feflow以及它的版本信息', () => {
    expect(shell.exec('node bin/feflow upgrade --e2e').stdout).to.empty('');
  });
});
