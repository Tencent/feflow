"use strict";
exports.__esModule = true;
var abbrev_1 = require("abbrev");
var Commander = /** @class */ (function () {
    function Commander(onRegistered) {
        this.store = {};
        this.invisibleStore = {};
        this.alias = {};
        if (typeof onRegistered === 'function')
            this.onRegistered = onRegistered;
    }
    Commander.prototype.get = function (name) {
        if (Object.prototype.toString.call(name) !== '[object String]') {
            return;
        }
        name = name.toLowerCase();
        var invisibleCommand = this.invisibleStore[name];
        if (invisibleCommand) {
            return invisibleCommand;
        }
        return this.store[this.alias[name]];
    };
    Commander.prototype.list = function () {
        return this.store;
    };
    Commander.prototype.register = function (name, desc, fn, options, pluginName) {
        var storeKey = name.toLowerCase();
        this.store[storeKey] = fn;
        this.store[name.toLowerCase()].desc = desc;
        this.store[name.toLowerCase()].options = options;
        this.store[name.toLowerCase()].pluginName = pluginName;
        this.alias = abbrev_1["default"](Object.keys(this.store));
        if (this.onRegistered) {
            this.onRegistered(storeKey);
        }
    };
    Commander.prototype.registerInvisible = function (name, fn, options, pluginName) {
        this.invisibleStore[name.toLowerCase()] = fn;
        this.invisibleStore[name.toLowerCase()].options = options;
        this.invisibleStore[name.toLowerCase()].pluginName = pluginName;
    };
    return Commander;
}());
exports["default"] = Commander;
//# sourceMappingURL=index.js.map