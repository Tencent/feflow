import shell from 'shelljs';
import chai from 'chai';

const { assert } = chai;

describe('@feflow/core - Native logger', () => {
  const loggerText = 'loggerText';

  it('fef logger 的参数为空时, 应输出 nothing types', () => {
    const expectedPattern = /nothing types\n*/;
    assert.match(shell.exec('node bin/feflow logger').stdout, expectedPattern);
  });

  it('fef logger info 应该可以正常输出指定的内容', () => {
    const expectedPattern = new RegExp(`\\[ Feflow Info \\]\\[ native \\] ${loggerText}\\n*`);
    assert.match(shell.exec(`node bin/feflow logger info ${loggerText}`).stdout, expectedPattern);
  });

  it('fef logger warn 应该可以正常输出指定的内容', () => {
    const expectedPattern = new RegExp(`\\[ Feflow Warn \\]\\[ native \\] ${loggerText}\\n*`);
    assert.match(shell.exec(`node bin/feflow logger warn ${loggerText}`).stderr, expectedPattern);
  });

  it('fef logger error 应该可以正常输出指定的内容', () => {
    const expectedPattern = new RegExp(`\\[ Feflow Error \\]\\[ native \\] ${loggerText}\\n*`);
    assert.match(shell.exec(`node bin/feflow logger error ${loggerText}`).stderr, expectedPattern);
  });
});
