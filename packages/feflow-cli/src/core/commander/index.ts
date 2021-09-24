import abbrev from 'abbrev';

interface CmdObj {
  runFn: Function;
  desc: string | Function;
  options?: Array<object>;
  pluginName?: string;
}

interface Store {
  [key: string]: CmdObj;
}

interface StrObj {
  [key: string]: string;
}
export default class Commander {
  private store: Store;
  private invisibleStore: Store;
  private alias: StrObj;
  private onRegistered?: Function;

  constructor(onRegistered?: Function) {
    this.store = {};
    this.invisibleStore = {};
    this.alias = {};
    if (typeof onRegistered === 'function') this.onRegistered = onRegistered;
  }

  get(name: string) {
    if (Object.prototype.toString.call(name) !== '[object String]') {
      return;
    }
    const finalName = name.toLowerCase();
    const invisibleCommand = this.invisibleStore[finalName];
    if (invisibleCommand) {
      return invisibleCommand;
    }
    return this.store[this.alias[finalName]];
  }

  list() {
    return this.store;
  }

  register(name: string, desc: string | Function, fn: Function, options?: Array<object>, pluginName?: string) {
    const storeKey = name.toLowerCase();
    this.store[storeKey] = {
      runFn: fn,
      desc,
      options,
      pluginName,
    };
    this.alias = abbrev(Object.keys(this.store));
    if (this.onRegistered) {
      this.onRegistered(storeKey);
    }
  }

  registerInvisible(name: string, fn: Function, options?: Array<object>, pluginName?: string) {
    const storeKey = name.toLowerCase();
    this.invisibleStore[storeKey] = {
      runFn: fn,
      desc: '',
      options,
      pluginName,
    };
  }
}
