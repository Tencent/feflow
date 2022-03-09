import shell from 'shelljs';
// import chai from 'chai';

// const { expect } = chai;

describe('@feflow/core - Native doctor', () => {
  beforeEach(() => {
    shell.exec('rm -rf .fef');
  });

  it('fef doctor 的输出信息中应该包含 Tools Version 和 Proxy config info', () => {
    shell.exec('node bin/feflow doctor --e2e');
  });
});
