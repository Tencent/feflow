import chai from 'chai';
import objectFactory from '../src/common/objectFactory'; // to-do: 把src改成lib后执行
const { expect } = chai;

describe('@feflow/report - objectFactory', () => {
  beforeEach(() => {
    objectFactory.done();
  });

  it('objectFactory - create', () => {
    const obj = objectFactory.create().done();

    expect(JSON.stringify(obj)).to.be.equal(JSON.stringify({}));
    expect(obj).to.deep.eq({});
  });

  it('objectFactory - load', () => {
    const obj = objectFactory
      .create()
      .load('a', 123)
      .load('b', 321)
      .load('c', () => 'awosome objectFactory')
      .done();
    expect(obj).to.be.not.equal(null);
    expect(obj).to.deep.eq({ a: 123, b: 321, c: 'awosome objectFactory' });
  });

  it('objectFactory - done', () => {
    const obj = objectFactory
      .create()
      .load('a', 123)
      .load('b', 321)
      .load('c', () => 'awosome objectFactory')
      .done();

    expect(obj).to.be.not.equal(null);
    expect(obj).to.deep.eq({ a: 123, b: 321, c: 'awosome objectFactory' });

    const newObj = objectFactory.create().done();

    expect(JSON.stringify(newObj)).to.be.equal(JSON.stringify({}));
  });
});
