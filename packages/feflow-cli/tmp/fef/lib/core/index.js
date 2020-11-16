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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = __importDefault(require("./commander"));
var hook_1 = __importDefault(require("./hook"));
var binp_1 = __importDefault(require("./universal-pkg/binp"));
var fs_1 = __importDefault(require("fs"));
var inquirer_1 = __importDefault(require("inquirer"));
var logger_1 = __importDefault(require("./logger"));
var osenv_1 = __importDefault(require("osenv"));
var path_1 = __importDefault(require("path"));
var easy_table_1 = __importDefault(require("easy-table"));
var cross_spawn_1 = __importDefault(require("cross-spawn"));
var loadPlugins_1 = __importDefault(require("./plugin/loadPlugins"));
var loadUniversalPlugin_1 = __importDefault(require("./plugin/loadUniversalPlugin"));
var loadDevkits_1 = __importDefault(require("./devkit/loadDevkits"));
var commandOptions_1 = __importDefault(require("./devkit/commandOptions"));
var constant_1 = require("../shared/constant");
var yaml_1 = require("../shared/yaml");
var packageJson_1 = __importDefault(require("../shared/packageJson"));
var npm_1 = require("../shared/npm");
var chalk_1 = __importDefault(require("chalk"));
var semver_1 = __importDefault(require("semver"));
var command_line_usage_1 = __importDefault(require("command-line-usage"));
var pkg_1 = require("./universal-pkg/dep/pkg");
var report_1 = __importDefault(require("@feflow/report"));
var checkCliUpdate_1 = __importDefault(require("../shared/checkCliUpdate"));
var pkg = require('../../package.json');
var Feflow = /** @class */ (function () {
    function Feflow(args) {
        args = args || {};
        var root = path_1.default.join(osenv_1.default.home(), constant_1.FEFLOW_ROOT);
        var configPath = path_1.default.join(root, '.feflowrc.yml');
        this.root = root;
        var bin = path_1.default.join(root, constant_1.FEFLOW_BIN);
        var lib = path_1.default.join(root, constant_1.FEFLOW_LIB);
        this.bin = bin;
        this.lib = lib;
        this.rootPkg = path_1.default.join(root, 'package.json');
        this.universalPkgPath = path_1.default.join(root, constant_1.UNIVERSAL_PKG_JSON);
        this.universalModules = path_1.default.join(root, constant_1.UNIVERSAL_MODULES);
        this.args = args;
        this.version = pkg.version;
        this.config = yaml_1.parseYaml(configPath);
        this.configPath = configPath;
        this.commander = new commander_1.default();
        this.hook = new hook_1.default();
        this.logger = logger_1.default({
            debug: Boolean(args.debug),
            silent: Boolean(args.silent),
        });
        this.reporter = new report_1.default(this);
        this.universalPkg = new pkg_1.UniversalPkg(this.universalPkgPath);
        this.initBinPath();
    }
    Feflow.prototype.init = function (cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var disableCheck;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.reporter.init && this.reporter.init(cmd);
                        if (!(cmd === 'config')) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.initClient()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.loadNative()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 14];
                    case 3: return [4 /*yield*/, this.initClient()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.initPackageManager()];
                    case 5:
                        _a.sent();
                        disableCheck = !this.args['disable-check'] && !(this.config.disableCheck === 'true');
                        if (!disableCheck) return [3 /*break*/, 8];
                        return [4 /*yield*/, checkCliUpdate_1.default(this, true)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.checkUpdate()];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [4 /*yield*/, this.loadNative()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, this.loadInternalPlugins()];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, loadPlugins_1.default(this)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, loadUniversalPlugin_1.default(this)];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, loadDevkits_1.default(this)];
                    case 13:
                        _a.sent();
                        _a.label = 14;
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    Feflow.prototype.initClient = function () {
        var _a = this, root = _a.root, rootPkg = _a.rootPkg;
        return new Promise(function (resolve, reject) {
            if (fs_1.default.existsSync(root) && fs_1.default.statSync(root).isFile()) {
                fs_1.default.unlinkSync(root);
            }
            if (!fs_1.default.existsSync(root)) {
                fs_1.default.mkdirSync(root);
            }
            if (!fs_1.default.existsSync(rootPkg)) {
                fs_1.default.writeFileSync(rootPkg, JSON.stringify({
                    name: 'feflow-home',
                    version: '0.0.0',
                    private: true,
                }, null, 2));
            }
            resolve();
        });
    };
    Feflow.prototype.initBinPath = function () {
        var bin = this.bin;
        if (fs_1.default.existsSync(bin) && fs_1.default.statSync(bin).isFile()) {
            fs_1.default.unlinkSync(bin);
        }
        if (!fs_1.default.existsSync(bin)) {
            fs_1.default.mkdirSync(bin);
        }
        new binp_1.default().register(bin);
    };
    Feflow.prototype.initPackageManager = function () {
        var _this = this;
        var _a = this, root = _a.root, logger = _a.logger;
        return new Promise(function (resolve, reject) {
            if (!_this.config || !_this.config.packageManager) {
                var isInstalled = function (packageName) {
                    try {
                        var ret = cross_spawn_1.default.sync(packageName, ['-v'], { stdio: 'ignore' });
                        if (ret.status !== 0) {
                            return false;
                        }
                        return true;
                    }
                    catch (err) {
                        return false;
                    }
                };
                var packageManagers = [
                    {
                        name: 'npm',
                        installed: isInstalled('npm'),
                    },
                    {
                        name: 'tnpm',
                        installed: isInstalled('tnpm'),
                    },
                    {
                        name: 'cnpm',
                        installed: isInstalled('cnpm'),
                    },
                    {
                        name: 'yarn',
                        installed: isInstalled('yarn'),
                    },
                ];
                var installedPackageManagers = packageManagers.filter(function (packageManager) { return packageManager.installed; });
                if (installedPackageManagers.length === 0) {
                    var notify = 'You must installed a package manager';
                    console.error(notify);
                }
                else {
                    var options = installedPackageManagers.map(function (installedPackageManager) { return installedPackageManager.name; });
                    inquirer_1.default
                        .prompt([
                        {
                            type: 'list',
                            name: 'packageManager',
                            message: 'Please select one package manager',
                            choices: options,
                        },
                    ])
                        .then(function (answer) {
                        var configPath = path_1.default.join(root, '.feflowrc.yml');
                        yaml_1.safeDump(answer, configPath);
                        _this.config = yaml_1.parseYaml(configPath);
                        resolve();
                    });
                }
                return;
            }
            logger.debug('Use packageManager is: ', _this.config.packageManager);
            resolve();
        });
    };
    Feflow.prototype.checkUpdate = function () {
        var _this = this;
        var _a = this, root = _a.root, rootPkg = _a.rootPkg, config = _a.config, logger = _a.logger;
        if (!config) {
            return;
        }
        var table = new easy_table_1.default();
        var packageManager = config.packageManager;
        return Promise.all(this.getInstalledPlugins().map(function (name) { return __awaiter(_this, void 0, void 0, function () {
            var pluginPath, content, pkg, localVersion, registryUrl, latestVersion;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pluginPath = path_1.default.join(root, 'node_modules', name, 'package.json');
                        content = fs_1.default.readFileSync(pluginPath);
                        pkg = JSON.parse(content);
                        localVersion = pkg.version;
                        return [4 /*yield*/, npm_1.getRegistryUrl(packageManager)];
                    case 1:
                        registryUrl = _a.sent();
                        return [4 /*yield*/, packageJson_1.default(name, registryUrl).catch(function (err) {
                                logger.debug('Check plugin update error', err);
                            })];
                    case 2:
                        latestVersion = _a.sent();
                        if (latestVersion && semver_1.default.gt(latestVersion, localVersion)) {
                            table.cell('Name', name);
                            table.cell('Version', localVersion === latestVersion
                                ? localVersion
                                : localVersion + " -> " + latestVersion);
                            table.cell('Tag', 'latest');
                            table.cell('Update', localVersion === latestVersion ? 'N' : 'Y');
                            table.newRow();
                            return [2 /*return*/, {
                                    name: name,
                                    latestVersion: latestVersion,
                                }];
                        }
                        logger.debug('All plugins is in latest version');
                        return [2 /*return*/];
                }
            });
        }); })).then(function (plugins) {
            plugins = plugins.filter(function (plugin) { return plugin && plugin.name; });
            if (plugins.length) {
                _this.logger.info('It will update your local templates or plugins, this will take few minutes');
                console.log(table.toString());
                _this.updatePluginsVersion(rootPkg, plugins);
                var needUpdatePlugins_1 = [];
                plugins.forEach(function (plugin) {
                    needUpdatePlugins_1.push(plugin.name);
                });
                return npm_1.install(packageManager, root, packageManager === 'yarn' ? 'add' : 'install', needUpdatePlugins_1, false, true).then(function () {
                    _this.logger.info('Plugin update success');
                });
            }
        });
    };
    Feflow.prototype.updatePluginsVersion = function (packagePath, plugins) {
        var obj = require(packagePath);
        plugins.forEach(function (plugin) {
            obj.dependencies[plugin.name] = plugin.latestVersion;
        });
        fs_1.default.writeFileSync(packagePath, JSON.stringify(obj, null, 4));
    };
    Feflow.prototype.getInstalledPlugins = function () {
        var _a = this, root = _a.root, rootPkg = _a.rootPkg;
        var plugins = [];
        var exist = fs_1.default.existsSync(rootPkg);
        var pluginDir = path_1.default.join(root, 'node_modules');
        if (!exist) {
            plugins = [];
        }
        else {
            var content = fs_1.default.readFileSync(rootPkg);
            var json = void 0;
            try {
                json = JSON.parse(content);
                var deps = json.dependencies || json.devDependencies || {};
                plugins = Object.keys(deps);
            }
            catch (ex) {
                plugins = [];
            }
        }
        return plugins.filter(function (name) {
            if (!/^feflow-plugin-|^@[^/]+\/feflow-plugin-|generator-|^@[^/]+\/generator-/.test(name)) {
                return false;
            }
            var pathFn = path_1.default.join(pluginDir, name);
            return fs_1.default.existsSync(pathFn);
        });
    };
    Feflow.prototype.loadNative = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var nativePath = path_1.default.join(__dirname, './native');
            fs_1.default.readdirSync(nativePath)
                .filter(function (file) { return file.endsWith('.js'); })
                // eslint-disable-next-line array-callback-return
                .map(function (file) {
                require(path_1.default.join(__dirname, './native', file))(_this);
            });
            resolve();
        });
    };
    Feflow.prototype.loadInternalPlugins = function () {
        var _this = this;
        // eslint-disable-next-line array-callback-return
        ['@feflow/feflow-plugin-devtool'].map(function (name) {
            try {
                _this.logger.debug('Plugin loaded: %s', chalk_1.default.magenta(name));
                return require(name)(_this);
            }
            catch (err) {
                _this.logger.error({ err: err }, 'Plugin load failed: %s', chalk_1.default.magenta(name));
            }
        });
    };
    Feflow.prototype.call = function (name, ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var args, hasHelp, cmd;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = ctx.args;
                        if (!(args.h || args.help)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.showCommandOptionDescription(name, ctx)];
                    case 1:
                        hasHelp = _a.sent();
                        if (hasHelp) {
                            return [2 /*return*/];
                        }
                        _a.label = 2;
                    case 2:
                        cmd = this.commander.get(name);
                        if (!cmd) return [3 /*break*/, 4];
                        return [4 /*yield*/, cmd.call(this, ctx)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4: throw new Error("Command `" + name + "` has not been registered yet!");
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Feflow.prototype.showCommandOptionDescription = function (cmd, ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var registriedCommand, commandLine, sections, usage;
            return __generator(this, function (_a) {
                registriedCommand = ctx.commander.get(cmd);
                commandLine = [];
                if (registriedCommand && registriedCommand.options) {
                    commandLine = commandOptions_1.default(registriedCommand.options, registriedCommand.desc, cmd);
                }
                if (cmd === 'help') {
                    return [2 /*return*/, registriedCommand.call(this, ctx)];
                }
                if (commandLine.length === 0) {
                    return [2 /*return*/, false];
                }
                sections = [];
                sections.push.apply(sections, __spread(commandLine));
                usage = command_line_usage_1.default(sections);
                console.log(usage);
                return [2 /*return*/, true];
            });
        });
    };
    return Feflow;
}());
exports.default = Feflow;
//# sourceMappingURL=index.js.map