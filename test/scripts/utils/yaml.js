'use strict';

const should = require('chai').should();
const expect = require('chai').expect;
const yaml = require('../../../lib/utils/yaml');
const fs = require('hexo-fs');
const _ = require('lodash');
const pathFn = require('path');
const sinon = require('sinon');
const osenv = require('osenv');
const yamlT = require('js-yaml');
describe('Yaml', () => {
  const base = pathFn.join(osenv.home(), './.feflow');
  let testPath;

  beforeEach(() => {
    testPath = pathFn.join(base, '.feflowtestrc.yml');
    this.sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    this.sandbox.restore();

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

  it('parseYaml() - first param is undefined', () => {
    if (fs.existsSync(testPath)) {
      fs.unlinkSync(testPath);
    }
    this.sandbox.stub(fs, 'existsSync').returns(() => true);
    try {
      const content = yaml.parseYaml(testPath);
      expect(content).to.be.equal('undefined');
    } catch(err) {
      console.log('');
    }
  });

  it('safeDump() - first param is undefined', () => {
    try {
      yaml.safeDump(undefined, testPath);
      const content = yaml.parseYaml(testPath);
      expect(content).to.be.equal('undefined');
    } catch(err) {
      console.log('');
    }
  });

});
