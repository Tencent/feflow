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
var commander_1 = __importDefault(require("./commander"));
var fs_1 = __importDefault(require("fs"));
var inquirer_1 = __importDefault(require("inquirer"));
var logger_1 = __importDefault(require("./logger"));
var osenv_1 = __importDefault(require("osenv"));
var path_1 = __importDefault(require("path"));
var easy_table_1 = __importDefault(require("easy-table"));
var cross_spawn_1 = __importDefault(require("cross-spawn"));
var loadPlugins_1 = __importDefault(require("./plugin/loadPlugins"));
var loadDevkits_1 = __importDefault(require("./devkit/loadDevkits"));
var constant_1 = require("../shared/constant");
var yaml_1 = require("../shared/yaml");
var packageJson_1 = __importDefault(require("../shared/packageJson"));
var npm_1 = require("../shared/npm");
var chalk_1 = __importDefault(require("chalk"));
var semver_1 = __importDefault(require("semver"));
var command_line_usage_1 = __importDefault(require("command-line-usage"));
var config_1 = __importDefault(require("./devkit/config"));
var pkg = require('../../package.json');
var Feflow = /** @class */ (function () {
    function Feflow(args) {
        args = args || {};
        var root = path_1.default.join(osenv_1.default.home(), constant_1.FEFLOW_ROOT);
        var configPath = path_1.default.join(root, '.feflowrc.yml');
        this.root = root;
        this.rootPkg = path_1.default.join(root, 'package.json');
        this.args = args;
        this.version = pkg.version;
        this.config = yaml_1.parseYaml(configPath);
        this.configPath = configPath;
        this.commander = new commander_1.default();
        this.logger = logger_1.default({
            debug: Boolean(args.debug),
            silent: Boolean(args.silent)
        });
    }
    Feflow.prototype.init = function (cmd) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(cmd === 'config')) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.initClient()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.loadNative()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 12];
                    case 3: return [4 /*yield*/, this.initClient()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.initPackageManager()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.checkCliUpdate()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.checkUpdate()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, this.loadNative()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, this.loadInternalPlugins()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, loadPlugins_1.default(this)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, loadDevkits_1.default(this)];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12: return [2 /*return*/];
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
                    'name': 'feflow-home',
                    'version': '0.0.0',
                    'private': true
                }, null, 2));
            }
            resolve();
        });
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
                        installed: isInstalled('npm')
                    },
                    {
                        name: 'tnpm',
                        installed: isInstalled('tnpm')
                    },
                    {
                        name: 'yarn',
                        installed: isInstalled('yarn')
                    }
                ];
                var installedPackageManagers = packageManagers.filter(function (packageManager) { return packageManager.installed; });
                if (installedPackageManagers.length === 0) {
                    var notify = "You must installed a package manager";
                    console.error(notify);
                }
                else {
                    var options = installedPackageManagers.map(function (installedPackageManager) {
                        return installedPackageManager.name;
                    });
                    inquirer_1.default.prompt([{
                            type: 'list',
                            name: 'packageManager',
                            message: 'Please select one package manager',
                            choices: options
                        }]).then(function (answer) {
                        var configPath = path_1.default.join(root, '.feflowrc.yml');
                        yaml_1.safeDump(answer, configPath);
                        _this.config = yaml_1.parseYaml(configPath);
                        resolve();
                    });
                }
                return;
            }
            else {
                logger.debug('Use packageManager is: ', _this.config.packageManager);
            }
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
                        return [4 /*yield*/, packageJson_1.default(name, 'latest', registryUrl).catch(function (err) {
                                logger.debug('Check plugin update error', err);
                            })];
                    case 2:
                        latestVersion = _a.sent();
                        if (latestVersion && latestVersion !== localVersion) {
                            table.cell('Name', name);
                            table.cell('Version', localVersion === latestVersion ? localVersion : localVersion + ' -> ' + latestVersion);
                            table.cell('Tag', 'latest');
                            table.cell('Update', localVersion === latestVersion ? 'N' : 'Y');
                            table.newRow();
                            return [2 /*return*/, {
                                    name: name,
                                    latestVersion: latestVersion
                                }];
                        }
                        else {
                            logger.debug('All plugins is in latest version');
                        }
                        return [2 /*return*/];
                }
            });
        }); })).then(function (plugins) {
            plugins = plugins.filter(function (plugin) {
                return plugin && plugin.name;
            });
            if (plugins.length) {
                _this.logger.info('It will update your local templates or plugins, this will take few minutes');
                console.log(table.toString());
                _this.updatePluginsVersion(rootPkg, plugins);
                var needUpdatePlugins_1 = [];
                plugins.map(function (plugin) {
                    needUpdatePlugins_1.push(plugin.name);
                });
                return npm_1.install(packageManager, root, 'install', needUpdatePlugins_1, false, true).then(function () {
                    _this.logger.info('Plugin update success');
                });
            }
        });
    };
    Feflow.prototype.updatePluginsVersion = function (packagePath, plugins) {
        var obj = require(packagePath);
        plugins.map(function (plugin) {
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
            fs_1.default.readdirSync(nativePath).filter(function (file) {
                return file.endsWith('.js');
            }).map(function (file) {
                require(path_1.default.join(__dirname, './native', file))(_this);
            });
            resolve();
        });
    };
    Feflow.prototype.loadInternalPlugins = function () {
        var _this = this;
        [
            '@feflow/feflow-plugin-devtool'
        ].map(function (name) {
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
        var _this = this;
        var args = ctx.args;
        if ((args.h || args.help) && name != "help") {
            return this.showCommandOptionDescription(name, ctx);
        }
        return new Promise(function (resolve, reject) {
            var cmd = _this.commander.get(name);
            if (cmd) {
                cmd.call(_this, ctx);
            }
            else {
                reject(new Error('Command `' + name + '` has not been registered yet!'));
            }
        });
    };
    Feflow.prototype.updateCli = function (packageManager) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var args = [
                            'install',
                            '@feflow/cli@latest',
                            '--color=always',
                            '--save',
                            '--save-exact',
                            '--loglevel',
                            'error',
                            '-g'
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
    };
    Feflow.prototype.checkCliUpdate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, version, config, configPath, packageManager, registryUrl, latestVersion, askIfUpdateCli, answer;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this, version = _a.version, config = _a.config, configPath = _a.configPath;
                        if (!config) {
                            return [2 /*return*/];
                        }
                        if (config.lastUpdateCheck && (+new Date() - parseInt(config.lastUpdateCheck, 10)) <= 1000 * 3600 * 24) {
                            return [2 /*return*/];
                        }
                        packageManager = config.packageManager;
                        return [4 /*yield*/, npm_1.getRegistryUrl(packageManager)];
                    case 1:
                        registryUrl = _b.sent();
                        return [4 /*yield*/, packageJson_1.default('@feflow/cli', 'latest', registryUrl)];
                    case 2:
                        latestVersion = _b.sent();
                        if (!semver_1.default.gt(latestVersion, version)) return [3 /*break*/, 6];
                        askIfUpdateCli = [{
                                type: "confirm",
                                name: "ifUpdate",
                                message: "" + chalk_1.default.yellow("@feflow/cli's latest version is " + chalk_1.default.green("" + latestVersion) + ", but your version is " + chalk_1.default.red("" + version) + ", Do you want to update it?"),
                                default: true
                            }];
                        return [4 /*yield*/, inquirer_1.default.prompt(askIfUpdateCli)];
                    case 3:
                        answer = _b.sent();
                        if (!answer.ifUpdate) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.updateCli(packageManager)];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        yaml_1.safeDump(__assign(__assign({}, config), { 'lastUpdateCheck': +new Date() }), configPath);
                        _b.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Feflow.prototype.showCommandOptionDescription = function (cmd, ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var config, kitJson, cmdDescription, optionDescrition, commands, _a, _b, cmdOptionDescrition_1, description, optionDescritions, sections, usage;
            var _this = this;
            return __generator(this, function (_c) {
                config = new config_1.default(ctx);
                kitJson = config.getDevKitConfig(ctx, cmd);
                optionDescrition = {
                    header: 'Options',
                    optionList: [],
                };
                ;
                if (kitJson.builders) {
                    commands = kitJson.builders;
                    _a = commands[cmd] || {}, _b = _a.optionsDescription, cmdOptionDescrition_1 = _b === void 0 ? {} : _b, description = _a.description;
                    cmdDescription = description;
                    optionDescritions = Object.keys(cmdOptionDescrition_1);
                    optionDescritions.forEach(function (option) {
                        var optionItemConfig = cmdOptionDescrition_1[option];
                        var optionDescritionItem = _this.getOptionItem(optionItemConfig, option);
                        optionDescrition.optionList.push(optionDescritionItem);
                    });
                }
                if (optionDescrition.optionList.length == 0) {
                    return [2 /*return*/, this.call("help", ctx)];
                }
                sections = [];
                sections.push({
                    header: "fef " + cmd,
                    content: cmdDescription
                });
                sections.push({
                    header: 'Usage',
                    content: "$ fef " + cmd + " [options]"
                });
                sections.push(optionDescrition);
                usage = command_line_usage_1.default(sections);
                console.log(usage);
                return [2 /*return*/];
            });
        });
    };
    Feflow.prototype.getOptionItem = function (optionItemConfig, option) {
        var optionDescritionItem = {};
        if (typeof optionItemConfig == 'string') {
            optionDescritionItem = {
                name: option,
                description: optionItemConfig,
            };
        }
        else {
            var name_1 = optionItemConfig.name, description = optionItemConfig.description, alias = optionItemConfig.alias, type = optionItemConfig.type, typeLabel = optionItemConfig.typeLabel;
            optionDescritionItem = {
                name: name_1,
                description: description,
                alias: alias,
                typeLabel: typeLabel,
                type: /boolean/i.test(type) ? Boolean : String,
            };
        }
        return optionDescritionItem;
    };
    ;
    return Feflow;
}());
exports.default = Feflow;
//# sourceMappingURL=index.js.map