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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var inquirer_1 = __importDefault(require("inquirer"));
var DEVTOOL_TYPE;
(function (DEVTOOL_TYPE) {
    DEVTOOL_TYPE["SCAFFLOAD"] = "\u811A\u624B\u67B6";
    DEVTOOL_TYPE["DEVKIT"] = "\u5F00\u53D1\u5957\u4EF6";
    DEVTOOL_TYPE["PLUGIN"] = "\u63D2\u4EF6";
})(DEVTOOL_TYPE || (DEVTOOL_TYPE = {}));
module.exports = function (ctx) {
    var args = ctx.args, commander = ctx.commander, logger = ctx.logger;
    var _a = __read(args['_'], 1), action = _a[0];
    commander.register('devtool', 'Feflow devtool for better develop a devkit or plugin', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, type_1, message, name_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = action;
                    switch (_a) {
                        case 'init': return [3 /*break*/, 1];
                        case 'dev': return [3 /*break*/, 4];
                    }
                    return [3 /*break*/, 5];
                case 1:
                    logger.debug('devtool init');
                    return [4 /*yield*/, inquirer_1.default.prompt([{
                                type: 'list',
                                name: 'type',
                                message: '选择你要接入的类型?',
                                choices: [
                                    DEVTOOL_TYPE.SCAFFLOAD,
                                    DEVTOOL_TYPE.DEVKIT,
                                    DEVTOOL_TYPE.PLUGIN
                                ]
                            }])];
                case 2:
                    type_1 = (_b.sent()).type;
                    message = void 0;
                    switch (type_1) {
                        case DEVTOOL_TYPE.SCAFFLOAD:
                            message = '以 generator- 开头';
                            break;
                        case DEVTOOL_TYPE.DEVKIT:
                            message = '以 feflow-devkit- 开头';
                            break;
                        case DEVTOOL_TYPE.PLUGIN:
                            message = '以 feflow-plugin- 开头';
                            break;
                    }
                    return [4 /*yield*/, inquirer_1.default.prompt([{
                                type: 'input',
                                name: 'name',
                                message: "\u8BF7\u8F93\u5165\u9879\u76EE\u540D\u79F0(" + message + ")",
                                choices: [
                                    DEVTOOL_TYPE.SCAFFLOAD,
                                    DEVTOOL_TYPE.DEVKIT,
                                    DEVTOOL_TYPE.PLUGIN
                                ],
                                validate: function (name) {
                                    switch (type_1) {
                                        case DEVTOOL_TYPE.SCAFFLOAD:
                                            return /^generator-/.test(name);
                                        case DEVTOOL_TYPE.DEVKIT:
                                            return /^feflow-devkit-/.test(name);
                                        case DEVTOOL_TYPE.PLUGIN:
                                            return /^feflow-plugin-/.test(name);
                                    }
                                    return false;
                                }
                            }])];
                case 3:
                    name_1 = (_b.sent()).name;
                    console.log('name', name_1);
                    return [3 /*break*/, 6];
                case 4:
                    console.log('dev');
                    return [3 /*break*/, 6];
                case 5: return [2 /*return*/, null];
                case 6: return [2 /*return*/];
            }
        });
    }); });
};
//# sourceMappingURL=index.js.map