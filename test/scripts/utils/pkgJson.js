const should = require('chai').should();
const expect = require('chai').expect;
const pkgJson = require('../../../lib/utils/pkgJson');

describe('pkgJson', () => {
  it('check get version', (done) => {
    pkgJson('feflow-cli', 'latest', 'http://registry.npmjs.org').then(json => {
      done();
      const version = json.version;
      expect(version).to.exist;
    })
  })

  it('check get version error', () => {
    pkgJson('feflow-cli', 'latest', '').then(json => {
      const err = json.err;
      expect(err).to.exist;
    })
  })

})