"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var osenv_1 = __importDefault(require("osenv"));
var path_1 = __importDefault(require("path"));
var compose = function () {
    var funcs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        funcs[_i] = arguments[_i];
    }
    if (funcs.length === 1) {
        return funcs[0];
    }
    return funcs.reduce(function (a, b) { return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return a(b.apply(void 0, args));
    }; });
};
function applyPlugins(plugins) {
    return function (ctx) {
        var chain = plugins.map(function (plugin) {
            var home = path_1.default.join(osenv_1.default.home(), './.feflow');
            var pluginPath = path_1.default.join(home, 'node_modules', plugin);
            return require(pluginPath)(ctx);
        });
        return compose.apply(void 0, chain);
    };
}
exports.applyPlugins = applyPlugins;
