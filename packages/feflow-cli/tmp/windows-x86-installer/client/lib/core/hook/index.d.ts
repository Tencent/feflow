export default class Hook {
    private listeners;
    private maxListener;
    constructor();
    on(type: any, listener: any): void;
    emit(type: any): void;
    /**
     * Run hook `type` callbacks and then invoke `fn()`.
     *
     * @private
     * @param {string} type
     * @param {Function} fn
     */
    hook(type: any, fn: any): void;
}
