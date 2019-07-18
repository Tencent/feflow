import abbrev from 'abbrev';

export default class Commander {

  private store: any;
  private alias: any;

  constructor() {
    this.store = {};
    this.alias = {};
  }

  get(name: string) {
    if (Object.prototype.toString.call(name) !== '[object String]') {
      return;
    }

    name = name.toLowerCase();
    return this.store[this.alias[name]];
  }

  list() {
    return this.store;
  }

  register(name: string, desc: string, fn: Function) {
    if (!name) {
      throw new TypeError('name is required');
    }

    if (!desc) {
      throw new TypeError('desc is required');
    }

    if (!fn) {
      throw new TypeError('fn must be a function');
    }

    const c = this.store[name.toLowerCase()] = fn;
    this.alias = abbrev(Object.keys(this.store));
  }
};
