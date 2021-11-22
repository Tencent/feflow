import chai from 'chai';
import objectFactory from '../src/common/objectFactory'; // to-do: 把src改成lib后执行
const { expect } = chai;

describe('@feflow/report - objectFactory', function () {
  beforeEach(function () {
    objectFactory.done();
  });

  it('objectFactory - create', function () {
    const obj = objectFactory.create().done();

    expect(obj).to.empty;
    expect(obj).to.deep.eq({});
  });

  it('objectFactory - load', function () {
    const obj = objectFactory
      .create()
      .load('a', 123)
      .load('b', 321)
      .load('c', () => 'awosome objectFactory')
      .done();
    expect(obj).to.not.empty;
    expect(obj).to.deep.eq({ a: 123, b: 321, c: 'awosome objectFactory' });
  });

  it('objectFactory - done', function () {
    const obj = objectFactory
      .create()
      .load('a', 123)
      .load('b', 321)
      .load('c', () => 'awosome objectFactory')
      .done();

    expect(obj).to.not.empty;
    expect(obj).to.deep.eq({ a: 123, b: 321, c: 'awosome objectFactory' });

    const obj2 = objectFactory.create().done();

    expect(obj2).to.empty;
  });
});
