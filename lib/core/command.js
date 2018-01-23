'use strict';

const Promise = require('bluebird');
const abbrev = require('abbrev');

/**
 * All commands need to be registered before using in CLI console.
 * After registered, command will store in context store, and ctx
 * will try to find it from store when call a command.
 *
 * @type {Command}
 */
module.exports = class Command {

  constructor() {
    this.store = {};
    this.alias = {};
  }

  /**
   * Get a command detail from ctx store.
   *
   * @param name   {String}   command name
   * @returns {*}
   */
  get(name) {
    name = name.toLowerCase();
    return this.store[this.alias[name]];
  }

  /**
   * List all commands.
   * @returns {{}|*}
   */
  list() {
    return this.store;
  }

  /**
   * Register a command, unique entrance for command registry.
   *
   * @param name   {String}   command name
   * @param desc   {String}   command description
   * @param options
   * @param fn     {Function} command callback
   */
  register(name, desc, options, fn) {
    if (!name) throw new TypeError('name is required');

    if (!fn) {
      if (options) {
        if (typeof options === 'function') {
          fn = options;

          if (typeof desc === 'object') { // name, options, fn
            options = desc;
            desc = '';
          } else { // name, desc, fn
            options = {};
          }
        } else {
          throw new TypeError('fn must be a function');
        }
      } else {
        // name, fn
        if (typeof desc === 'function') {
          fn = desc;
          options = {};
          desc = '';
        } else {
          throw new TypeError('fn must be a function');
        }
      }
    }

    if (fn.length > 1) {
      fn = Promise.promisify(fn);
    } else {
      fn = Promise.method(fn);
    }

    const c = this.store[name.toLowerCase()] = fn;
    c.options = options;
    c.desc = desc;

    this.alias = abbrev(Object.keys(this.store));
  }
};
