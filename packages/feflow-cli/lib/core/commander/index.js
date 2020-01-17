"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var abbrev_1 = __importDefault(require("abbrev"));
var Commander = /** @class */ (function () {
    function Commander() {
        this.store = {};
        this.alias = {};
    }
    Commander.prototype.get = function (name) {
        if (Object.prototype.toString.call(name) !== '[object String]') {
            return;
        }
        name = name.toLowerCase();
        return this.store[this.alias[name]];
    };
    Commander.prototype.list = function () {
        return this.store;
    };
    Commander.prototype.register = function (name, desc, fn) {
        this.store[name.toLowerCase()] = fn;
        this.store[name.toLowerCase()].desc = desc;
        this.alias = abbrev_1.default(Object.keys(this.store));
    };
    return Commander;
}());
exports.default = Commander;
;
//# sourceMappingURL=index.js.map