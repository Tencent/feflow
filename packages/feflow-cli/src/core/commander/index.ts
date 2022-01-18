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

  get(cmdName?: string) {
    if (Object.prototype.toString.call(cmdName) !== '[object String]') {
      return;
    }
    const finalName = cmdName!.toLowerCase();
    const invisibleCommand = this.invisibleStore[finalName];
    if (invisibleCommand) {
      return invisibleCommand;
    }
    return this.store[this.alias[finalName]];
  }

  list() {
    return this.store;
  }

  register(cmdName: string, desc: CmdObj['desc'], fn: Function, options?: Array<object>, pluginName?: string) {
    const storeKey = cmdName.toLowerCase();
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

  registerInvisible(cmdName: string, fn: Function, options?: Array<object>, pluginName?: string) {
    const storeKey = cmdName.toLowerCase();
    this.invisibleStore[storeKey] = {
      runFn: fn,
      desc: '',
      options,
      pluginName,
    };
  }
}
