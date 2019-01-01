const should = require('chai').should();
const expect = require('chai').expect;
const date = require('../../../lib/utils/date')


describe('date', () => {
  const dateType = ['yyyy-MM-dd']
  const dateNow = new Date();
  let year = dateNow.getFullYear();
  let month = dateNow.getMonth() + 1;
  let day = dateNow.getDate();
  it('test date format', () => {
    dateType.forEach(item => {
      date.formatDate(item, dateNow).should.eql(`${year}-${month > 9 ? month : '0' + month}-${day > 9 ? day : '0' + day }`);
    })
  })
})