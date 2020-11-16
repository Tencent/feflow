export default class Commander {
    private store;
    private invisibleStore;
    private alias;
    constructor();
    get(name: any): any;
    list(): any;
    register(name: string, desc: string, fn: Function, options?: Array<object>, pluginName?: string): void;
    registerInvisible(name: string, fn: Function, options?: Array<object>, pluginName?: string): void;
}
