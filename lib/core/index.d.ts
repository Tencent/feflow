export default class Feflow {
    private version;
    private logger;
    private commander;
    constructor(args: any);
    init(): Promise<void>;
    call(name: any, args: any): Promise<any>;
}
