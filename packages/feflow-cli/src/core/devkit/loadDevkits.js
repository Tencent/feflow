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
exports.__esModule = true;
var path_1 = require("path");
var config_1 = require("./config");
var commandOptions_1 = require("./commandOptions");
var constant_1 = require("../../shared/constant");
var registerDevkitCommand = function (command, commandConfig, directoryPath, ctx) {
    var builder = commandConfig.builder;
    var _a = __read(builder.split(':', 2), 1), packageName = _a[0];
    var config = new config_1["default"](ctx);
    var pkgPath = path_1["default"].join(directoryPath, 'node_modules', packageName);
    try {
        var devkitConfig = config.loadDevkitConfig(pkgPath);
        var _b = devkitConfig.builders[command], implementation_1 = _b.implementation, description = _b.description, optionsDescription = _b.optionsDescription, _c = _b.usage, usage = _c === void 0 ? {} : _c;
        var options = commandOptions_1["default"](optionsDescription || usage, description, command);
        if (Array.isArray(implementation_1)) {
            ctx.commander.register(command, description, function () { return __awaiter(void 0, void 0, void 0, function () {
                var i, action;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            i = 0;
                            _a.label = 1;
                        case 1:
                            if (!(i < implementation_1.length)) return [3 /*break*/, 4];
                            action = path_1["default"].join(pkgPath, implementation_1[i]);
                            return [4 /*yield*/, require(action)(ctx)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            }); }, options, packageName);
        }
        else {
            var action_1 = path_1["default"].join(pkgPath, implementation_1);
            ctx.commander.register(command, description, function () {
                require(action_1)(ctx);
            }, options, packageName);
        }
    }
    catch (e) {
        ctx.logger.debug(pkgPath + " not found!");
    }
};
function loadDevkits(ctx) {
    var config = new config_1["default"](ctx);
    var configData = config.loadProjectConfig();
    var directoryPath = config.getProjectDirectory();
    return new Promise(function (resolve, reject) {
        if (configData) {
            ctx.projectPath = directoryPath;
            ctx.projectConfig = configData;
            if (configData.devkit && configData.devkit.commands) {
                var commandsConfig = configData.devkit.commands;
                for (var command in commandsConfig) {
                    var commandConfig = commandsConfig[command];
                    registerDevkitCommand(command, commandConfig, directoryPath, ctx);
                }
            }
            else {
                if (path_1["default"].basename(directoryPath) === constant_1.FEFLOW_ROOT) {
                    ctx.logger.debug('Run commands in .fef root will not work.');
                }
                else {
                    ctx.logger.error("A config file .feflowrc(.js|.yaml|.yml|.json) was detected in " + directoryPath + ", but lost required property 'commands' in field 'devkit'. Please check your config file or just delete it.");
                }
            }
        }
        else {
            ctx.logger.debug('Run commands not in a feflow project.');
        }
        resolve();
    });
}
exports["default"] = loadDevkits;
//# sourceMappingURL=loadDevkits.js.map