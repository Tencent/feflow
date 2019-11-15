import abbrev from 'abbrev';

export default class Commander implements CommanderInterface {

  private store: CommanderStore;
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
    const c = this.store[name.toLowerCase()] = fn;
    this.alias = abbrev(Object.keys(this.store));
  }
};
