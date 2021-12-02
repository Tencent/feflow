import abbrev from 'abbrev';

export interface CmdObj {
  runFn: Function;
  desc: string | (() => string);
  options?: Array<object>;
  pluginName?: string;
}

export type Store = Record<string, CmdObj>;

interface StrObj {
  [key: string]: string;
}

export default class Commander {
  store: Store;
  private readonly invisibleStore: Store;
  private alias: StrObj;
  private readonly onRegistered?: Function;

  constructor(onRegistered?: Function) {
    this.store = {};
    this.invisibleStore = {};
    this.alias = {};
    if (typeof onRegistered === 'function') this.onRegistered = onRegistered;
  }

  get(name?: string) {
    if (Object.prototype.toString.call(name) !== '[object String]') {
      return;
    }
    const finalName = name!.toLowerCase();
    const invisibleCommand = this.invisibleStore[finalName];
    if (invisibleCommand) {
      return invisibleCommand;
    }
    return this.store[this.alias[finalName]];
  }

  list() {
    return this.store;
  }

  register(name: string, desc: CmdObj['desc'], fn: Function, options?: Array<object>, pluginName?: string) {
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
