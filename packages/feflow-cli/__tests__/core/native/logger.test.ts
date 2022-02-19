import shell from 'shelljs';
import chai from 'chai';

const { expect } = chai;

describe('@feflow/core - Native logger', () => {
  const loggerText = 'loggerText';

  it('测试 fef logger', () => {
    expect(shell.exec(`node bin/feflow logger`).stdout).to.equal('nothing types\n');
  });

  it('测试 fef logger info', () => {
    expect(shell.exec(`node bin/feflow logger info ${loggerText}`).stdout).to.equal(
      `[ Feflow Info ][ native ] ${loggerText}\n`,
    );
  });

  it('测试 fef logger warn', () => {
    expect(shell.exec(`node bin/feflow logger warn ${loggerText}`).stderr).to.equal(
      `[ Feflow Warn ][ native ] ${loggerText}\n`,
    );
  });

  it('测试 fef logger error', () => {
    expect(shell.exec(`node bin/feflow logger error ${loggerText}`).stderr).to.equal(
      `[ Feflow Error ][ native ] ${loggerText}\n`,
    );
  });
});
