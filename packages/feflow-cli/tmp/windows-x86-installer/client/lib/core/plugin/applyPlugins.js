"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var compose_1 = __importDefault(require("./compose"));
var chalk_1 = __importDefault(require("chalk"));
var osenv_1 = __importDefault(require("osenv"));
var path_1 = __importDefault(require("path"));
var constant_1 = require("../../shared/constant");
function applyPlugins(plugins) {
    return function (ctx) {
        if (!plugins.length) {
            return;
        }
        // eslint-disable-next-line array-callback-return
        var chain = plugins.map(function (name) {
            var home = path_1.default.join(osenv_1.default.home(), constant_1.FEFLOW_ROOT);
            var pluginPath = path_1.default.join(home, 'node_modules', name);
            try {
                ctx.logger.debug('Plugin loaded: %s', chalk_1.default.magenta(name));
                return require(pluginPath)(ctx);
            }
            catch (err) {
                ctx.logger.error({ err: err }, 'Plugin load failed: %s', chalk_1.default.magenta(name));
            }
        });
        return compose_1.default.apply(void 0, __spread(chain));
    };
}
exports.default = applyPlugins;
//# sourceMappingURL=applyPlugins.js.map