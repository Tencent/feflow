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
exports.__esModule = true;
var command_line_usage_1 = require("command-line-usage");
var child_process_1 = require("child_process");
var npm_1 = require("../../shared/npm");
var axios_1 = require("axios");
module.exports = function (ctx) {
    function showToolVersion() {
        return __awaiter(this, void 0, void 0, function () {
            var sections, _a, _b, _c, result;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = [{
                                header: 'Your environment information',
                                content: 'Show something very important.'
                            },
                            {
                                header: 'Tools Version',
                                optionList: [
                                    {
                                        name: 'node ',
                                        typeLabel: '{underline Version:}',
                                        description: executeSync('node -v')
                                    },
                                    {
                                        name: 'npm ',
                                        typeLabel: '{underline Version:}',
                                        description: executeSync('npm -v')
                                    },
                                    {
                                        name: 'tnpm ',
                                        typeLabel: '{underline Version:}',
                                        description: executeSync('tnpm -v')
                                    },
                                    {
                                        name: 'fef ',
                                        typeLabel: '{underline Version:}',
                                        description: executeSync('fef -v')
                                    },
                                    {
                                        name: 'Python ',
                                        typeLabel: '{underline Version:}',
                                        description: executeSync('python -c "import platform; print(platform.python_version())"')
                                    }
                                ]
                            },
                            {
                                header: 'Proxy config info',
                                optionList: [
                                    {
                                        name: 'http_porxy ',
                                        typeLabel: '{underline info:}',
                                        description: executeSync('echo $http_proxy')
                                    },
                                    {
                                        name: 'npm_config_porxy ',
                                        typeLabel: '{underline info:}',
                                        description: executeSync('npm config get proxy')
                                    },
                                    {
                                        name: 'npm_config_registry ',
                                        typeLabel: '{underline info:}',
                                        description: executeSync('npm config get registry')
                                    },
                                    {
                                        name: 'npm user_config path ',
                                        typeLabel: '{underline info:}',
                                        description: executeSync('npm config get userconfig')
                                    },
                                    {
                                        name: 'iOA pac ',
                                        typeLabel: '{underline info:}',
                                        description: '@TODO'
                                    }
                                ]
                            }];
                        _b = {
                            header: 'Network access info'
                        };
                        _c = {
                            name: 'curl npm_config_registry ',
                            typeLabel: '{underline info:}'
                        };
                        return [4 /*yield*/, accessTnpmRegistry()];
                    case 1:
                        sections = _a.concat([
                            (_b.optionList = [
                                (_c.description = _d.sent(),
                                    _c)
                            ],
                                _b)
                        ]);
                        result = command_line_usage_1["default"](sections);
                        return [2 /*return*/, result];
                }
            });
        });
    }
    function executeSync(command) {
        var resultBuf;
        try {
            resultBuf = child_process_1.execSync(command);
        }
        catch (e) {
            return e.message;
        }
        var result = resultBuf.toString("utf8").trim();
        return result;
    }
    ;
    function accessTnpmRegistry() {
        return __awaiter(this, void 0, void 0, function () {
            var tnpmRegistry, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, npm_1.getRegistryUrl('tnpm')];
                    case 1:
                        tnpmRegistry = _a.sent();
                        tnpmRegistry = tnpmRegistry.trim().split('\n');
                        tnpmRegistry = tnpmRegistry[tnpmRegistry.length - 1];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, axios_1["default"].get(tnpmRegistry)];
                    case 3:
                        response = _a.sent();
                        if (response.status === 200) {
                            return [2 /*return*/, 'access tnpm registry is ok!'];
                        }
                        else {
                            return [2 /*return*/, 'access tnpm registry has error, http code: ${response.statusCode}'];
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        return [2 /*return*/, 'access tnpm registry has error: ${error}'];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    ctx.commander.register('doctor', 'environment information', function () {
        showToolVersion().then(function (result) {
            console.log(result);
        })["catch"](function (error) {
            console.log('error:', error);
        });
    });
};
//# sourceMappingURL=doctor.js.map