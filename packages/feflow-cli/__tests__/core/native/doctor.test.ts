import shell from 'shelljs';
import chai from 'chai';

const { assert } = chai;

describe('@feflow/core - Native doctor', () => {
  it('fef doctor 的输出信息中应该包含 Tools Version 和 Proxy config info', () => {
    // 由于每台机器上node等版本可能不同，因此这里不对完整的信息做断言，只检查是否包含关键信息来保证fef doctor正常运行即可
    const expectedPattern = /[\s\S]*Tools Version[\s\S]*Proxy config info[\s\S]*/;
    assert.match(shell.exec('node bin/feflow doctor').stdout, expectedPattern);
  });
});
