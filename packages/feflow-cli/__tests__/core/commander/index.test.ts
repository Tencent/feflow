import chai from 'chai';
import Commander from '../../../src/core/commander';
const expect = chai.expect;

describe('@feflow/core - Commander Unit Test', () => {
  it('register(name, desc, fn) - Register a command', () => {
    const command = new Commander();
    command.register('test', 'test description', () => {});
    expect(command.get('test')).to.not.an('undefined');
  });

  it('get(name) - Get a command', () => {
    const command = new Commander();
    command.register('test', 'test description', () => {});
    expect(command.get('test')).to.not.an('undefined');
  });

  it('get(name) - Get a command not a string', () => {
    const command = new Commander();
    command.register('test', 'test description', () => {});
    expect(command.get(1)).to.be.an('undefined');
  });

  it('list() - List all command', () => {
    const command = new Commander();
    command.register('test', 'test description', () => {});
    expect(command.list()).to.haveOwnProperty('test');
  });
});
