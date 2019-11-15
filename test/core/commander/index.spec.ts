import chai from 'chai';
import Commander from '../../../lib/core/commander';
const should = chai.should();
const expect = chai.expect;

describe('@feflow/core - Commander Unit Test', () => {

  it('register(name, desc, fn) - Register a command', () => {
    const command = new Commander();
    command.register('test', 'test description', () => {});
    expect(command.get('test')).should.exist;
  });

  it('get(name) - Get a command', () => {
    const command = new Commander();
    command.register('test', 'test description', () => {});
    expect(command.get('test')).should.exist;
  });

  it('get(name) - Get a command not a string', () => {
    const command = new Commander();
    command.register('test', 'test description', () => {});
    expect(command.get("1")).to.be.an('undefined');
  });

  it('list() - List all command', () => {
    const command = new Commander();
    command.register('test', 'test description', () => {});
    command.list().should.have.keys(['test']);
  });
});