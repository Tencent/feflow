import chai from 'chai';
import objectFactory from '../src/common/objectFactory';
const expect = chai.expect;

describe('@feflow/report - objectFactory', () => {
  beforeEach(() => {
    objectFactory.done();
  });

  it('objectFactory - create', () => {
    const obj = objectFactory.create().done();

    expect(obj).to.empty;
    expect(obj).to.deep.eq({});
  });

  it('objectFactory - load', function() {
    const obj = objectFactory.create()
      .load('a', 123)
      .load('b', 321)
      .load('c', () => 'awosome objectFactory')
      .done();
    expect(obj).to.not.empty;
    expect(obj).to.deep.eq({ a: 123, b: 321, c: 'awosome objectFactory' });
  });

  it('objectFactory - done', function() {
    const obj = objectFactory.create()
      .load('a', 123)
      .load('b', 321)
      .load('c', () => 'awosome objectFactory')
      .done();

    expect(obj).to.not.empty;
    expect(obj).to.deep.eq({ a: 123, b: 321, c: 'awosome objectFactory' });

    const _obj = objectFactory.create().done();

    expect(_obj).to.empty;
  });
});
