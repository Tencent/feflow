'use strict';

const should = require('chai').should();
const Command = require('../../../lib/core/command');

describe('Register a command', () => {

  it('register() - register command with zero param and no command name', () => {
    const command = new Command();
    try {
      command.register();
    } catch (err) {
      err.should.be
        .instanceOf(TypeError)
        .property('message', 'name is required');
    }
  });

  it('register() - register command with one param and no command callback', () => {
    const command = new Command();

    try {
      command.register('test');
    } catch (err) {
      err.should.be
        .instanceOf(TypeError)
        .property('message', 'fn must be a function');
    }
  });

  it('register() - register command with two params and desc is not a function', () => {
    const command = new Command();

    try {
      command.register('test', 'test description');
    } catch (err) {
      err.should.be
        .instanceOf(TypeError)
        .property('message', 'fn must be a function');
    }
  });

  it('register() - register command with two params and desc is a function', () => {
    const command = new Command();

    command.register('test', () => {});
    command.get('test').should.exist;
  });

  it('register() - register command with three params and options is not a function', () => {
    const command = new Command();

    try {
      command.register('test', 'test description', {});
    } catch (err) {
      err.should.be
        .instanceOf(TypeError)
        .property('message', 'fn must be a function');
    }
  });

   it('register() - register command with three params and options is a function', () => {
    const command = new Command();

    command.register('test', 'test description', () => {});
    command.get('test').should.exist;
  });

  it('register() - register command with four params and fn length equals to 1', () => {
    const command = new Command();

    command.register('test', 'test desc', {}, () => {});
    command.get('test').should.exist;
  });

  it('register() - register command with three params, desc is options', () => {
    const command = new Command();

    command.register('test', {}, () => {});
    command.get('test').should.exist;
  });

  it('register() - register command with four params and fn length greater than 1', () => {
    const command = new Command();

    command.register('test', 'test desc', {}, (param1, param2) => {});
    command.get('test').should.exist;
  });

  it('get()', () => {
    const command = new Command();
    command.register('test', () => {
    });
    command.get('test').should.exist;
  });

  it('list()', () => {
    const command = new Command();
    command.register('test', () => {
    });
    command.list().should.have.keys(['test']);
  });
});
