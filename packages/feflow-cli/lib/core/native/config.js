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
Object.defineProperty(exports, "__esModule", { value: true });
var yaml_1 = require("../../shared/yaml");
module.exports = function (ctx) {
    var args = ctx.args, _a = ctx.config, config = _a === void 0 ? {} : _a, configPath = ctx.configPath;
    var _b = __read(args['_'], 3), action = _b[0], key = _b[1], value = _b[2];
    ctx.commander.register('config', 'Config client', function () {
        switch (action) {
            case 'get':
                console.log(ctx.config[key]);
                break;
            case 'set':
                config[key] = value;
                yaml_1.safeDump(config, configPath);
                break;
            case 'list':
                var str = '';
                for (var prop in config) {
                    str += prop + ' = ' + config[prop] + '\n';
                }
                console.log(str.replace(/\s+$/g, ''));
                break;
            default:
                return null;
        }
    });
};
//# sourceMappingURL=config.js.map