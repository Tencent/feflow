import shell from 'shelljs';
import chai from 'chai';

const { expect } = chai;

describe.only('@feflow/core - Native logger', () => {
  const loggerText = 'loggerText';

  it('fef logger 的参数为空时, 应输出 nothing types', () => {
    expect(shell.exec(`node bin/feflow logger`).stdout).to.equal('nothing types\n');
  });

  it('fef logger info 应该可以正常输出指定的内容', () => {
    expect(shell.exec(`node bin/feflow logger info ${loggerText}`).stdout).to.equal(
      `[ Feflow Info ][ native ] ${loggerText}\n`,
    );
  });

  it('fef logger warn 应该可以正常输出指定的内容', () => {
    expect(shell.exec(`node bin/feflow logger warn ${loggerText}`).stderr).to.equal(
      `[ Feflow Warn ][ native ] ${loggerText}\n`,
    );
  });

  it('fef logger error 应该可以正常输出指定的内容', () => {
    expect(shell.exec(`node bin/feflow logger error ${loggerText}`).stderr).to.equal(
      `[ Feflow Error ][ native ] ${loggerText}\n`,
    );
  });
});
