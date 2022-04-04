import shell from 'shelljs';
import chai from 'chai';

const { assert } = chai;

describe('@feflow/core - Native upgrade', () => {
  beforeEach(() => {
    shell.exec('rm -rf .fef');
  });

  it('执行 fef upgrade 应该返回upgrade提示信息', () => {
    const expectContentPattern = /E2E: upgrade/;
    assert(expectContentPattern.test(shell.exec('node bin/feflow upgrade').stdout));
  });
});
