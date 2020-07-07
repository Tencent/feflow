import abbrev from 'abbrev';

export default class Commander {
  private store: any;
  private invisibleStore: any;
  private alias: any;
  private onRegistered?: Function;

  constructor(onRegistered?: Function) {
    this.store = {};
    this.invisibleStore = {};
    this.alias = {};
    if (typeof onRegistered === 'function') this.onRegistered = onRegistered;
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

  register(name: string, desc: string | Function, fn: Function, options?: Array<object>, pluginName?: string) {
    const storeKey = name.toLowerCase();
    this.store[storeKey] = fn;
    this.store[name.toLowerCase()].desc = desc;
    this.store[name.toLowerCase()].options = options;
    this.store[name.toLowerCase()].pluginName = pluginName;
    this.alias = abbrev(Object.keys(this.store));
    if (this.onRegistered) {
      this.onRegistered(storeKey);
    }
  }

  registerInvisible(name: string, fn: Function, options?: Array<object>, pluginName?: string) {
    this.invisibleStore[name.toLowerCase()] = fn;
    this.invisibleStore[name.toLowerCase()].options = options;
    this.invisibleStore[name.toLowerCase()].pluginName = pluginName;
  }
}
