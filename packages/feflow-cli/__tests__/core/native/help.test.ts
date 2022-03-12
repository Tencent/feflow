import shell from 'shelljs';
import chai from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';

const { expect } = chai;
chai.use(jestSnapshotPlugin());

describe('@feflow/core - Native help', () => {
  it('测试 fef help', () => {
    // 由于help命令的返回信息并不会经常改变，因此这里采用快照的方式
    expect(shell.exec('node bin/feflow help').stdout).matchSnapshot();
  });
});
