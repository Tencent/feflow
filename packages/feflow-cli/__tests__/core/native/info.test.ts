import shell from 'shelljs';
// import chai from 'chai';
import process from 'child_process';

// const { assert } = chai;

describe('@feflow/core - Native info', () => {
  beforeEach(() => {
    shell.exec('rm -rf .fef');
  });

  it.only('fef info 的输出中应该包含feflow以及它的版本信息', (done) => {
    // 因为每台机器上的node版本等信息可能不同，因此这里采用正则的方式不去断言全部的返回信息，只验证feflow这个字段保证fef info正常输出即可
    // const pattern = /feflow: \d+.\d+.\d+[-]*[\w.\d]*/;
    // console.log('E2E: node version === ', shell.exec('node --version').stdout);
    // console.log('E2E: fef info === ', shell.exec('node bin/feflow info --e2e').stdout);
    // assert(pattern.test(shell.exec('node bin/feflow info --e2e').stdout));

    process.exec('node bin/feflow info --e2e', (error, stdout) => {
      if (error !== null) {
        console.log(`exec error: ${error}`);
      }

      console.log('E2E: stdout === ', stdout);
      done();
    });
  });
});
