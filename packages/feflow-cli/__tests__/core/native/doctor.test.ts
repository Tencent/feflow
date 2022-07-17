import shell from 'shelljs';
import chai from 'chai';

const { assert } = chai;

describe('测试 @feflow/cli  - Native doctor', () => {
  it('fef doctor 的输出信息中应该包含 Tools Version 和 Proxy config info', () => {
    const expectedPattern = /[\s\S]*Tools Version[\s\S]*Proxy config info[\s\S]*/;
    assert.match(shell.exec('node bin/feflow doctor').stdout, expectedPattern);
  });
});
