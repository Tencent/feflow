import shell from 'shelljs';
import chai from 'chai';

const { assert } = chai;

describe('@feflow/core - Native upgrade', () => {
  it('执行 fef upgrade 应该返回upgrade提示信息', () => {
    const expectedPattern = /E2E: upgrade/;
    assert.match(shell.exec('node bin/feflow upgrade').stdout, expectedPattern);
  });
});
