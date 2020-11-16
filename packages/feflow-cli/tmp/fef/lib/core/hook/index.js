"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constant_1 = require("../../shared/constant");
var Hook = /** @class */ (function () {
    function Hook() {
        this.listeners = [];
        this.maxListener = 100;
    }
    Hook.prototype.on = function (type, listener) {
        var listeners = this.listeners;
        if (listeners[type] && listeners[type].length >= this.maxListener) {
            throw new Error("Listener's maxCount is " + this.maxListener + ", has exceed");
        }
        if (listeners[type] instanceof Array) {
            if (listeners[type].indexOf(listener) === -1) {
                listeners[type].push(listener);
            }
        }
        else {
            listeners[type] = [].concat(listener);
        }
    };
    Hook.prototype.emit = function (type) {
        var _this = this;
        // eslint-disable-next-line prefer-rest-params
        var args = Array.prototype.slice.call(arguments);
        args.shift();
        switch (type) {
            case constant_1.HOOK_TYPE_BEFORE:
                this.hook(constant_1.HOOK_TYPE_BEFORE, function () {
                    _this.emit(constant_1.EVENT_COMMAND_BEGIN);
                });
                break;
            case constant_1.HOOK_TYPE_AFTER:
                this.hook(constant_1.HOOK_TYPE_AFTER, function () {
                    _this.emit(constant_1.EVENT_DONE);
                });
                break;
            default:
                var listeners = this.listeners[type];
                if (!listeners) {
                    return;
                }
                this.listeners[type].forEach(function (listener) {
                    // eslint-disable-next-line prefer-spread
                    listener.apply(null, args);
                });
                break;
        }
    };
    /**
     * Run hook `type` callbacks and then invoke `fn()`.
     *
     * @private
     * @param {string} type
     * @param {Function} fn
     */
    Hook.prototype.hook = function (type, fn) {
        var hooks = this.listeners[type];
        var next = function (i) {
            var hook = hooks[i];
            if (!hook) {
                return fn();
            }
            var result = hook.call();
            if (result && typeof result.then === 'function') {
                result.then(function () {
                    // eslint-disable-next-line no-plusplus
                    next(++i);
                }, function () {
                    throw new Error('Promise rejected with no or falsy reason');
                });
            }
            else {
                // eslint-disable-next-line no-plusplus
                next(++i);
            }
        };
        process.nextTick(function () {
            if (!hooks) {
                return fn();
            }
            next(0);
        });
    };
    return Hook;
}());
exports.default = Hook;
//# sourceMappingURL=index.js.map