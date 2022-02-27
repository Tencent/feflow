import shell from 'shelljs';
import chai from 'chai';

const { expect } = chai;

describe('@feflow/core - Native list', () => {
  it('测试 fef logger', () => {
    expect(shell.exec(`node bin/feflow list --debug --e2e`).stdout).to.equal('nothing types\n');
  });
});
