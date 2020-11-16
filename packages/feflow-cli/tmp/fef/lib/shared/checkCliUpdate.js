"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cross_spawn_1 = __importDefault(require("cross-spawn"));
var npm_1 = require("./npm");
var packageJson_1 = __importDefault(require("./packageJson"));
var semver_1 = __importDefault(require("semver"));
var chalk_1 = __importDefault(require("chalk"));
var inquirer_1 = __importDefault(require("inquirer"));
var yaml_1 = require("./yaml");
function updateCli(packageManager) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var args = packageManager === 'yarn'
                        ? ['global', 'add', '@feflow/cli@latest', '--extract']
                        : [
                            'install',
                            '@feflow/cli@latest',
                            '--color=always',
                            '--save',
                            '--save-exact',
                            '--loglevel',
                            'error',
                            '-g',
                        ];
                    var child = cross_spawn_1.default(packageManager, args, { stdio: 'inherit' });
                    child.on('close', function (code) {
                        if (code !== 0) {
                            reject({
                                command: packageManager + " " + args.join(' '),
                            });
                            return;
                        }
                        resolve();
                    });
                })];
        });
    });
}
function checkCliUpdate(ctx, needAuto) {
    return __awaiter(this, void 0, void 0, function () {
        var version, config, configPath, packageManager, registryUrl, latestVersion, askIfUpdateCli, answer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    version = ctx.version, config = ctx.config, configPath = ctx.configPath;
                    if (!config) {
                        return [2 /*return*/];
                    }
                    packageManager = config.packageManager;
                    if (needAuto
                        && ctx.config.lastUpdateCheck
                        && +new Date() - parseInt(ctx.config.lastUpdateCheck, 10) <= 1000 * 3600 * 24) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, npm_1.getRegistryUrl(packageManager)];
                case 1:
                    registryUrl = _a.sent();
                    return [4 /*yield*/, packageJson_1.default('@feflow/cli', registryUrl).catch(function () {
                            ctx.logger.warn("Network error, can't reach " + registryUrl + ", CLI give up verison check.");
                        })];
                case 2:
                    latestVersion = _a.sent();
                    if (!(latestVersion && semver_1.default.gt(latestVersion, version))) return [3 /*break*/, 7];
                    askIfUpdateCli = [
                        {
                            type: 'confirm',
                            name: 'ifUpdate',
                            message: "" + chalk_1.default.yellow("@feflow/cli's latest version is " + chalk_1.default.green("" + latestVersion) + ", but your version is " + chalk_1.default.red("" + version) + ", Do you want to update it?"),
                            default: true,
                        },
                    ];
                    return [4 /*yield*/, inquirer_1.default.prompt(askIfUpdateCli)];
                case 3:
                    answer = _a.sent();
                    if (!answer.ifUpdate) return [3 /*break*/, 5];
                    return [4 /*yield*/, updateCli(packageManager)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    yaml_1.safeDump(__assign(__assign({}, config), { lastUpdateCheck: +new Date() }), configPath);
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    ctx.logger.info('Current version is already latest.');
                    _a.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.default = checkCliUpdate;
//# sourceMappingURL=checkCliUpdate.js.map