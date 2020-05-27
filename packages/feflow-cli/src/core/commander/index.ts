import abbrev from 'abbrev';

export default class Commander {
  private store: any;
  private invisibleStore: any;
  private alias: any;

  constructor() {
    this.store = {};
    this.invisibleStore = {};
    this.alias = {};
  }

  get(name: any) {
    if (Object.prototype.toString.call(name) !== '[object String]') {
      return;
    }

    name = name.toLowerCase();
    const invisibleCommand = this.invisibleStore[name];
    if (invisibleCommand) {
      return invisibleCommand;
    }
    return this.store[this.alias[name]];
  }

  list() {
    return this.store;
  }

  register(name: string, desc: string, fn: Function, options?: Array<object>) {
    this.store[name.toLowerCase()] = fn;
    this.store[name.toLowerCase()].desc = desc;
    this.store[name.toLowerCase()].options = options;
    this.alias = abbrev(Object.keys(this.store));
  }

  registerInvisible(name: string, fn: Function, options?: Array<object>) {
    this.invisibleStore[name.toLowerCase()] = fn;
    this.invisibleStore[name.toLowerCase()].options = options;
  }
}
