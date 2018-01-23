'use strict';

const should = require('chai').should();
const expect = require('chai').expect;
const fs = require('hexo-fs');
const _ = require('lodash');
const pathFn = require('path');
const sinon = require('sinon');
const osenv = require('osenv');
const sep = pathFn.sep;


describe('Yaml', () => {
  const yaml = require('../../../lib/utils/yaml');
  const base = pathFn.join(osenv.home(), './.feflow');
  let testPath;

  beforeEach(function () {
    testPath = pathFn.join(base, '.feflowtestrc.yml');
  });

  afterEach(function () {
    if (fs.existsSync(testPath)) {
      fs.unlinkSync(testPath);
    }
  });

  function isNullObj(val) {
    if (!_.isObject(val)) return false;
    for (let prop in val) {
      if (val.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  }

  it('parseYaml() - path not exists', () => {
    if (fs.existsSync(testPath)) {
      fs.unlinkSync(testPath);
    }

    expect(yaml.parseYaml(testPath)).to.be.equal(undefined);
  });

  it('parseYaml() - path exists but no content', () => {
    if (fs.existsSync(testPath)) {
      fs.unlinkSync(testPath);
    }

    fs.writeFileSync(testPath, '', 'utf-8')

    expect(yaml.parseYaml(testPath)).to.be.equal(undefined);
  });

  it('parseYaml() - path exists and has content', () => {
    if (fs.existsSync(testPath)) {
      fs.unlinkSync(testPath);
    }

    fs.writeFileSync(testPath, 'test', 'utf-8')

    expect(yaml.parseYaml(testPath)).to.be.equal('test');
  });

  it('safeDump() - null object', () => {
    yaml.safeDump({}, testPath);

    const content = yaml.parseYaml(testPath);
    expect(isNullObj(content)).to.be.equal(true);
  });

});
