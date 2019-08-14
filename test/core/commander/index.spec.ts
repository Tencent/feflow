import chai from 'chai';
import Commander from '../../../src/core/commander';
const should = chai.should();

describe('Commander Unit Test', () => {

   it('register(name, desc, fn) - Register a command', () => {
    const command = new Commander();
    command.register('test', 'test description', () => {});
    command.get('test').should.exist;
  });

  it('get(name) - Get a command', () => {
    const command = new Commander();
    command.register('test', 'test description', () => {});
    command.get('test').should.exist;
  });

  it('list() - List all command', () => {
    const command = new Commander();
    command.register('test', 'test description', () => {});
    command.list().should.have.keys(['test']);
  });
});