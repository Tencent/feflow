'use strict';

const chai = require('chai');

chai.use(require('chai-as-promised'));

describe('feflow-cli test case', () => {
  require('./scripts/core');
  require('./scripts/internal');
  require('./scripts/utils');
});
