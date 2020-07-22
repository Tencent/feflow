'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-test:app', () => {
  beforeAll(() => helpers
    .run(path.join(__dirname, '../generators/app'))
    .withOptions({ log: logMock })
    .withPrompts({ someAnswer: true }));

  // it('creates files', () => {
  //   assert.file(['']);
  // });
});
