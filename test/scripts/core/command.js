'use strict';

const should = require('chai').should();

describe('Register command', () => {
  const Command = require('../../../lib/core/command');

  it('register()', () => {
    const command = new Command();

    command.register('test', () => {
    });

    command.get('test').should.exist;

    // no fn
    try {
      command.register('test');
    } catch (err) {
      err.should.be
        .instanceOf(TypeError)
        .property('message', 'fn must be a function');
    }
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
