import shell from 'shelljs';
import chai from 'chai';

const { assert } = chai;

describe('测试 @feflow/cli - Native help', () => {
  it('fef help 应该可以正常输出帮助信息', () => {
    // 输出的信息中应该包含Usage,Commands,Options等信息
    const expectedPattern = /[\s\S]*Usage[\s\S]*Commands[\s\S]*Options[\s\S]*/;
    assert.match(shell.exec('node bin/feflow help').stdout, expectedPattern);
  });
});
