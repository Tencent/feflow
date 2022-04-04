import shell from 'shelljs';
import chai from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';

const { expect } = chai;
chai.use(jestSnapshotPlugin());

describe('@feflow/core - Native help', () => {
  it('fef help 应该可以正常输出帮助信息', () => {
    // 因为fef help的返回信息一般不会改变，因此这里采用快照方案进行测试
    expect(shell.exec('node bin/feflow help').stdout).matchSnapshot();
  });
});
