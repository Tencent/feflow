export default class Commander {
    private store;
    private alias;
    constructor();
    get(name: any): any;
    list(): any;
    register(name: string, desc: string, fn: Function): void;
}
