import shell from 'shelljs';
import chai from 'chai';
import { jestSnapshotPlugin } from 'mocha-chai-jest-snapshot';

const { expect } = chai;
chai.use(jestSnapshotPlugin());

describe('@feflow/core - Native help', () => {
  it('测试 fef help', () => {
    expect(shell.exec('node bin/feflow help').stdout).matchSnapshot();
  });
});
