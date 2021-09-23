/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
import chai from 'chai';
import { getUserName } from '../src/common/utils'; // to-do: 把src改成lib后执行

const { expect } = chai;

describe('@feflow/report - report', () => {
  it('getUserName() - username is not empty', function () {
    const username = getUserName();

    expect(username).to.not.empty;
  });
});
