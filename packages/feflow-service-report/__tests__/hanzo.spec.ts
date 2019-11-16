import chai from 'chai';
import Hanzo from '../src/common/hanzo';
const should = chai.should();
const expect = chai.expect;

describe('@feflow/report - ', () => {
  beforeEach(() => {
    Hanzo.done();
  });

  it('Hanzo - create', () => {
    const obj = Hanzo.create().done();

    expect(obj).to.empty;
    expect(obj).to.deep.eq({});
  });

  it('Hanzo - load', function() {
    const obj = Hanzo.create()
      .load('a', 123)
      .load('b', 321)
      .load('c', () => 'awosome hanzo')
      .done();
    expect(obj).to.not.empty;
    expect(obj).to.deep.eq({ a: 123, b: 321, c: 'awosome hanzo' });
  });

  it('Hanzo - done', function() {
    const obj = Hanzo.create()
      .load('a', 123)
      .load('b', 321)
      .load('c', () => 'awosome hanzo')
      .done();

    expect(obj).to.not.empty;
    expect(obj).to.deep.eq({ a: 123, b: 321, c: 'awosome hanzo' });

    const _obj = Hanzo.create().done();

    expect(_obj).to.empty;
  });
});
