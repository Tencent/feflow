"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
exports.__esModule = true;
var path_1 = require("path");
var yaml_1 = require("../../shared/yaml");
var plugin_1 = require("../universal-pkg/schema/plugin");
var constant_1 = require("../../shared/constant");
var binp_1 = require("../universal-pkg/binp");
var updateUniversalPlugin = require('../native/install').updateUniversalPlugin;
var toolRegex = /^feflow-(?:devkit|plugin)-(.*)/i;
var excludeAgrs = ['--disable-check', '--slient'];
function loadPlugin(ctx, pkg, version) {
    var pluginPath = path_1["default"].join(ctx.root, constant_1.UNIVERSAL_MODULES, pkg + "@" + version);
    var pluginConfigPath = path_1["default"].join(pluginPath, constant_1.UNIVERSAL_PLUGIN_CONFIG);
    var config = yaml_1.parseYaml(pluginConfigPath) || {};
    return new plugin_1.Plugin(ctx, pluginPath, config);
}
function register(ctx, pkg, version, global) {
    var _this = this;
    if (global === void 0) { global = false; }
    var commander = ctx.commander;
    var pluginCommand = (toolRegex.exec(pkg) || [])[1] || pkg;
    if (!pluginCommand) {
        ctx.logger.debug("invalid universal plugin name: " + pluginCommand);
        return;
    }
    if (global) {
        // load plugin.yml delay
        commander.register(pluginCommand, function () {
            return loadPlugin(ctx, pkg, version).desc || pkg + " universal plugin description";
        }, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execPlugin(ctx, pkg, version)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }, [function () {
                var plugin = loadPlugin(ctx, pkg, version);
                return plugin.usage ? {
                    type: "usage",
                    content: plugin.usage
                } : {
                    type: "path",
                    content: plugin.path
                };
            }], pkg);
    }
    else {
        commander.registerInvisible(pluginCommand + "@" + version, function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execPlugin(ctx, pkg, version)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }, [], pkg + "@" + version);
    }
}
function execPlugin(ctx, pkg, version) {
    return __awaiter(this, void 0, void 0, function () {
        var pluginPath, plugin, args, e_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    pluginPath = path_1["default"].join(ctx.root, constant_1.UNIVERSAL_MODULES, pkg + "@" + version);
                    plugin = loadPlugin(ctx, pkg, version);
                    // make it find dependencies
                    new binp_1["default"]().register(path_1["default"].join(pluginPath, "." + constant_1.FEFLOW_BIN), true, true);
                    // injection plugin path into the env
                    process.env[constant_1.FEF_ENV_PLUGIN_PATH] = pluginPath;
                    plugin.preRun.run();
                    args = process.argv.slice(3).filter(function (arg) {
                        if (excludeAgrs.includes(arg)) {
                            return false;
                        }
                        return true;
                    });
                    (_a = plugin.command).run.apply(_a, __spread(args));
                    plugin.postRun.runLess();
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, updateUniversalPlugin(ctx, pkg, version, plugin)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _b.sent();
                    ctx.logger.debug("[" + pkg + "] update fail, " + e_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function loadUniversalPlugin(ctx) {
    return __awaiter(this, void 0, void 0, function () {
        var universalPkg, installed, installed_1, installed_1_1, _a, pkg, version, dependencies, dependencies_1, dependencies_1_1, _b, pkg, versionRelations, versionRelations_1, versionRelations_1_1, _c, version;
        var e_2, _d, e_3, _e, e_4, _f;
        return __generator(this, function (_g) {
            universalPkg = ctx.universalPkg;
            installed = universalPkg.getInstalled();
            try {
                for (installed_1 = __values(installed), installed_1_1 = installed_1.next(); !installed_1_1.done; installed_1_1 = installed_1.next()) {
                    _a = __read(installed_1_1.value, 2), pkg = _a[0], version = _a[1];
                    register(ctx, pkg, version, true);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (installed_1_1 && !installed_1_1.done && (_d = installed_1["return"])) _d.call(installed_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            dependencies = universalPkg.getAllDependencies();
            try {
                for (dependencies_1 = __values(dependencies), dependencies_1_1 = dependencies_1.next(); !dependencies_1_1.done; dependencies_1_1 = dependencies_1.next()) {
                    _b = __read(dependencies_1_1.value, 2), pkg = _b[0], versionRelations = _b[1];
                    try {
                        for (versionRelations_1 = (e_4 = void 0, __values(versionRelations)), versionRelations_1_1 = versionRelations_1.next(); !versionRelations_1_1.done; versionRelations_1_1 = versionRelations_1.next()) {
                            _c = __read(versionRelations_1_1.value, 1), version = _c[0];
                            register(ctx, pkg, version, false);
                        }
                    }
                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                    finally {
                        try {
                            if (versionRelations_1_1 && !versionRelations_1_1.done && (_f = versionRelations_1["return"])) _f.call(versionRelations_1);
                        }
                        finally { if (e_4) throw e_4.error; }
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (dependencies_1_1 && !dependencies_1_1.done && (_e = dependencies_1["return"])) _e.call(dependencies_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            return [2 /*return*/];
        });
    });
}
exports["default"] = loadUniversalPlugin;
//# sourceMappingURL=loadUniversalPlugin.js.map