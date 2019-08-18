import chai from 'chai';
import compose from '../../../src/core/plugin/compose';
const should = chai.should();

describe('@feflow/core - Plugin compose', () => {
  it('Composes from right to left', () => {
    const double = (x: number) => x * 2;
    const square = (x: number) => x * x;

    compose(square)(5).should.eql(25);

    compose(
      square,
      double
    )(5).should.eql(100);

    compose(
      double,
      square,
      double
    )(5).should.eql(200);
  });

  it('Composes functions from right to left', () => {
    const a = (next: any) => (x: string) => next(x + 'a');
    const b = (next: any) => (x: string) => next(x + 'b');
    const c = (next: any) => (x: string) => next(x + 'c');
    const final = (x: any) => x;
    compose(
      a,
      b,
      c
    )(final)('').should.eql('abc');

    compose(
      b,
      c,
      a
    )(final)('').should.eql('bca');

    compose(
      c,
      a,
      b
    )(final)('').should.eql('cab');
  });

  it('Can be seeded with multiple arguments', () => {
    const square = (x: number) => x * x
    const add = (x: number, y: number) => x + y

    compose(
      square,
      add
    )(1, 2).should.eql(9);
  });

  it('Returns the first function if given only one', () => {
    const fn = () => {};

    compose(fn).should.eql(fn);
  });
});