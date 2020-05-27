import abbrev from 'abbrev';

export default class Commander {

  private store: any;
  private alias: any;

  constructor() {
    this.store = {};
    this.alias = {};
  }

  get(name: any) {
    if (Object.prototype.toString.call(name) !== '[object String]') {
      return;
    }

    name = name.toLowerCase();
    return this.store[this.alias[name]];
  }

  list() {
    return this.store;
  }

  register(name: string, desc: string, fn: Function, options?: Array<object>, pluginName?: string) {
    this.store[name.toLowerCase()] = fn;
    this.store[name.toLowerCase()].desc = desc;
    this.store[name.toLowerCase()].options = options;
    this.store[name.toLowerCase()].pluginName = pluginName;
    this.alias = abbrev(Object.keys(this.store));
  }
};
