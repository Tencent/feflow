const should = require('chai').should();
const expect = require('chai').expect;
const pkgJson = require('../../../lib/utils/pkgJson')


describe('pkgJson', () => {
  pkgJson('feflow-cli', 'latest', '').then(json => {
    const version = pkg.version;
    it('check get version', () => {
      expect(version).to.exist;
    })
  })
})