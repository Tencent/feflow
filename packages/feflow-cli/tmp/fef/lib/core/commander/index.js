"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var abbrev_1 = __importDefault(require("abbrev"));
var Commander = /** @class */ (function () {
    function Commander() {
        this.store = {};
        this.invisibleStore = {};
        this.alias = {};
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
        this.store[name.toLowerCase()] = fn;
        this.store[name.toLowerCase()].desc = desc;
        this.store[name.toLowerCase()].options = options;
        this.store[name.toLowerCase()].pluginName = pluginName;
        this.alias = abbrev_1.default(Object.keys(this.store));
    };
    Commander.prototype.registerInvisible = function (name, fn, options, pluginName) {
        this.invisibleStore[name.toLowerCase()] = fn;
        this.invisibleStore[name.toLowerCase()].options = options;
        this.invisibleStore[name.toLowerCase()].pluginName = pluginName;
    };
    return Commander;
}());
exports.default = Commander;
//# sourceMappingURL=index.js.map