/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
import chai from 'chai';
import { getUserName } from '../src/common/utils'; // to-do: 把src改成lib后执行
const Report = require('../src/index'); // to-do: 把src改成lib后执行

const { expect } = chai;

describe('@feflow/report - report', () => {
  let report;

  before(() => {
    report = new Report({ root: '/' });
  });

  it('getUserName() - username is not empty', () => {
    const username = getUserName();

    expect(username).to.be.not.equal(null);
  });

  after(() => {
    report = null;
  });
});
