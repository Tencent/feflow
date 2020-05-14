import compose from '../../../src/core/plugin/compose';
import chai from 'chai';
const expect = chai.expect;

describe('@feflow/core - Plugin compose', () => {
  it('Composes from right to left', () => {
    const double = (x: number) => x * 2;
    const square = (x: number) => x * x;

    expect(compose(square)(5)).to.be.eql(25);

    expect(compose(square, double)(5)).to.eql(100);

    expect(compose(double, square, double)(5)).to.be.eql(200);
  });

  it('Composes functions from right to left', () => {
    const a = (next: any) => (x: string) => next(x + 'a');
    const b = (next: any) => (x: string) => next(x + 'b');
    const c = (next: any) => (x: string) => next(x + 'c');
    const final = (x: any) => x;
    expect(compose(a, b, c)(final)('')).to.be.eql('abc');

    expect(compose(b, c, a)(final)('')).to.be.eql('bca');

    expect(compose(c, a, b)(final)('')).to.be.eql('cab');
  });

  it('Can be seeded with multiple arguments', () => {
    const square = (x: number) => x * x;
    const add = (x: number, y: number) => x + y;

    expect(compose(square, add)(1, 2)).to.be.eql(9);
  });

  it('Returns the first function if given only one', () => {
    const fn = () => {};

    expect(compose(fn)).to.be.eql(fn);
  });
});
