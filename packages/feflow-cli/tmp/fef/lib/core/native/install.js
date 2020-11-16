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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var npm_1 = require("../../shared/npm");
var cross_spawn_1 = __importDefault(require("cross-spawn"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var request_promise_1 = __importDefault(require("request-promise"));
var packageJson_1 = __importDefault(require("../../shared/packageJson"));
var git_1 = require("../universal-pkg/repository/git");
var yaml_1 = require("../../shared/yaml");
var constant_1 = require("../../shared/constant");
var git_2 = require("../../shared/git");
var plugin_1 = require("../universal-pkg/schema/plugin");
var linker_1 = __importDefault(require("../universal-pkg/linker"));
var version_1 = __importDefault(require("../universal-pkg/dep/version"));
var uniq_1 = __importDefault(require("../universal-pkg/upgrade/uniq"));
var upgradeUniq = new uniq_1.default();
var account;
function download(url, filepath) {
    return __awaiter(this, void 0, void 0, function () {
        var cloneUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, git_2.transformUrl(url, account)];
                case 1:
                    cloneUrl = _a.sent();
                    console.log('cloneUrl', url);
                    return [2 /*return*/, cross_spawn_1.default.sync('git', ['clone', cloneUrl, filepath], {
                            stdio: 'inherit',
                        })];
            }
        });
    });
}
function resolvePlugin(ctx, repoPath) {
    var pluginFile = path_1.default.join(repoPath, constant_1.UNIVERSAL_PLUGIN_CONFIG);
    var exists = fs_1.default.existsSync(pluginFile);
    if (!exists) {
        throw "the " + constant_1.UNIVERSAL_PLUGIN_CONFIG + " file was not found";
    }
    var config;
    try {
        config = yaml_1.parseYaml(pluginFile);
    }
    catch (e) {
        throw "the " + constant_1.UNIVERSAL_PLUGIN_CONFIG + " file failed to resolve, please check the syntax, e: " + e;
    }
    return new plugin_1.Plugin(ctx, repoPath, config);
}
function getRepoInfo(ctx, packageName) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var serverUrl, options;
        return __generator(this, function (_b) {
            serverUrl = (_a = ctx.config) === null || _a === void 0 ? void 0 : _a.serverUrl;
            options = {
                url: serverUrl + "apply/getlist?name=" + packageName,
                method: 'GET',
            };
            return [2 /*return*/, request_promise_1.default(options).then(function (response) {
                    var data = JSON.parse(response);
                    if (data.account) {
                        // eslint-disable-next-line prefer-destructuring
                        account = data.account;
                    }
                    return data.data && data.data[0];
                })
                    .catch(function (err) {
                    ctx.logger.debug('Get repo info error', err);
                })];
        });
    });
}
function getRepoName(repoUrl) {
    var ret = /^.*\/(.*).git$/.exec(repoUrl);
    if (ret && ret.length === 2) {
        return ret[1];
    }
}
function deleteDir(dirPath) {
    var files = [];
    if (fs_1.default.existsSync(dirPath)) {
        files = fs_1.default.readdirSync(dirPath);
        files.forEach(function (file) {
            var curPath = dirPath + "/" + file;
            if (fs_1.default.statSync(curPath).isDirectory()) {
                deleteDir(curPath);
            }
            else {
                fs_1.default.unlinkSync(curPath);
            }
        });
        fs_1.default.rmdirSync(dirPath);
    }
}
module.exports = function (ctx) {
    ctx.commander.register('install', 'Install a devkit or plugin', function () { return __awaiter(void 0, void 0, void 0, function () {
        var dependencies, _a, installPluginStr, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    dependencies = ctx.args._;
                    _a = __read(dependencies, 1), installPluginStr = _a[0];
                    if (!installPluginStr) {
                        ctx.logger.error('parameter error');
                        return [2 /*return*/];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, installPlugin(ctx, installPluginStr, true)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _b.sent();
                    ctx.logger.error("install error: " + e_1);
                    process.exit(2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    ctx.commander.register('uninstall', 'Uninstall a devkit or plugin', function () { return __awaiter(void 0, void 0, void 0, function () {
        var dependencies, serverUrl, _a, installPluginStr, pkgInfo;
        var _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    dependencies = ctx.args._;
                    ctx.logger.info('Uninstalling packages. This might take a couple of minutes.');
                    serverUrl = (_b = ctx.config) === null || _b === void 0 ? void 0 : _b.serverUrl;
                    if (!serverUrl) {
                        return [2 /*return*/, npm_1.install((_c = ctx === null || ctx === void 0 ? void 0 : ctx.config) === null || _c === void 0 ? void 0 : _c.packageManager, ctx.root, ((_d = ctx === null || ctx === void 0 ? void 0 : ctx.config) === null || _d === void 0 ? void 0 : _d.packageManager) === 'yarn' ? 'remove' : 'uninstall', dependencies, false, true).then(function () {
                                ctx.logger.info('uninstall success');
                            })];
                    }
                    _a = __read(dependencies, 1), installPluginStr = _a[0];
                    return [4 /*yield*/, getPkgInfo(ctx, installPluginStr)];
                case 1:
                    pkgInfo = _g.sent();
                    if (pkgInfo) {
                        return [2 /*return*/, uninstallUniversalPlugin(ctx, pkgInfo)];
                    }
                    return [2 /*return*/, npm_1.install((_e = ctx === null || ctx === void 0 ? void 0 : ctx.config) === null || _e === void 0 ? void 0 : _e.packageManager, ctx.root, ((_f = ctx === null || ctx === void 0 ? void 0 : ctx.config) === null || _f === void 0 ? void 0 : _f.packageManager) === 'yarn' ? 'remove' : 'uninstall', dependencies, false, true).then(function () {
                            ctx.logger.info('uninstall success');
                        })];
            }
        });
    }); });
};
function isGitRepo(url) {
    return (/^git@.+:.+\/.+\.git$/.test(url)
        || /^http(s)?:\/\/.+\/.+\/.+\.git$/.test(url));
}
function installNpmPlugin(ctx) {
    var _a;
    var dependencies = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        dependencies[_i - 1] = arguments[_i];
    }
    return __awaiter(this, void 0, void 0, function () {
        var packageManager, registryUrl;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    packageManager = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.config) === null || _a === void 0 ? void 0 : _a.packageManager;
                    return [4 /*yield*/, npm_1.getRegistryUrl(packageManager)];
                case 1:
                    registryUrl = _b.sent();
                    return [4 /*yield*/, Promise.all(dependencies.map(function (dependency) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                try {
                                    return [2 /*return*/, packageJson_1.default(dependency, registryUrl)];
                                }
                                catch (err) {
                                    ctx.logger.error(dependency + " not found on " + packageManager);
                                    ctx.logger.error(dependency + " not found on " + packageManager);
                                    process.exit(2);
                                }
                                return [2 /*return*/];
                            });
                        }); }))];
                case 2:
                    _b.sent();
                    ctx.logger.info('Installing packages. This might take a couple of minutes.');
                    return [2 /*return*/, npm_1.install(packageManager, ctx.root, packageManager === 'yarn' ? 'add' : 'install', dependencies, false, true).then(function () {
                            ctx.logger.info('install success');
                        })];
            }
        });
    });
}
function installPlugin(ctx, installPluginStr, global) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var logger, universalPkg, universalModules, bin, lib, serverUrl, pkgInfo, updateFlag, repoPath, currentVersion, linker, oldVersion, oldDependencies, plugin, pluginBin, pluginLib, _b, _c, depPlugin, curPkgInfo, commandName, e_2, e_3_1, oldDependencies_1, oldDependencies_1_1, _d, oldPkg, oldPkgVersion;
        var e_3, _e, e_4, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    logger = ctx.logger, universalPkg = ctx.universalPkg, universalModules = ctx.universalModules, bin = ctx.bin, lib = ctx.lib;
                    serverUrl = (_a = ctx.config) === null || _a === void 0 ? void 0 : _a.serverUrl;
                    installPluginStr = installPluginStr.trim();
                    if (!serverUrl) {
                        return [2 /*return*/, installNpmPlugin(ctx, ctx === null || ctx === void 0 ? void 0 : ctx.args['_'])];
                    }
                    return [4 /*yield*/, getPkgInfo(ctx, installPluginStr)];
                case 1:
                    pkgInfo = _g.sent();
                    if (!pkgInfo) {
                        return [2 /*return*/, installNpmPlugin(ctx, ctx === null || ctx === void 0 ? void 0 : ctx.args['_'])];
                    }
                    if (!pkgInfo.repoName) {
                        throw "plugin [" + pkgInfo.repoName + "] does not exist";
                    }
                    // if the specified version is already installed, skip it
                    if (universalPkg.isInstalled(pkgInfo.repoName, pkgInfo.checkoutTag, !global)) {
                        return [2 /*return*/];
                    }
                    updateFlag = false;
                    repoPath = path_1.default.join(universalModules, pkgInfo.repoName + "@" + pkgInfo.installVersion);
                    if (!(pkgInfo.installVersion === constant_1.LATEST_VERSION)) return [3 /*break*/, 3];
                    if (!universalPkg.isInstalled(pkgInfo.repoName, constant_1.LATEST_VERSION)) return [3 /*break*/, 3];
                    return [4 /*yield*/, git_1.getCurrentTag(repoPath)];
                case 2:
                    currentVersion = _g.sent();
                    if (!currentVersion || pkgInfo.checkoutTag === currentVersion) {
                        return [2 /*return*/];
                    }
                    updateFlag = true;
                    _g.label = 3;
                case 3:
                    if (updateFlag) {
                        if (!upgradeUniq.upgradeable(pkgInfo.repoName, pkgInfo.installVersion)) {
                            return [2 /*return*/];
                        }
                        logger.info("[" + pkgInfo.repoName + "] update the plugin to version " + pkgInfo.checkoutTag);
                        resolvePlugin(ctx, repoPath).preUpgrade.runLess();
                    }
                    else {
                        logger.info("[" + pkgInfo.repoName + "] installing plugin");
                    }
                    logger.debug('install version:', pkgInfo.checkoutTag);
                    if (!!fs_1.default.existsSync(repoPath)) return [3 /*break*/, 5];
                    logger.info("Start download from " + pkgInfo.repoUrl);
                    return [4 /*yield*/, download(pkgInfo.repoUrl, repoPath)];
                case 4:
                    _g.sent();
                    _g.label = 5;
                case 5:
                    linker = new linker_1.default();
                    logger.info("switch to version: " + pkgInfo.checkoutTag);
                    git_1.checkoutVersion(repoPath, pkgInfo.checkoutTag);
                    oldVersion = universalPkg.getInstalled().get(pkgInfo.repoName);
                    if (global && oldVersion) {
                        oldDependencies = universalPkg.getDependencies(pkgInfo.repoName, oldVersion);
                        if (oldDependencies) {
                            oldDependencies = new Map(oldDependencies);
                        }
                    }
                    plugin = resolvePlugin(ctx, repoPath);
                    // check the validity of the plugin before installing it
                    return [4 /*yield*/, plugin.check()];
                case 6:
                    // check the validity of the plugin before installing it
                    _g.sent();
                    logger.debug('check plugin success');
                    pluginBin = path_1.default.join(repoPath, "." + constant_1.FEFLOW_BIN);
                    pluginLib = path_1.default.join(repoPath, "." + constant_1.FEFLOW_LIB);
                    _g.label = 7;
                case 7:
                    _g.trys.push([7, 15, 16, 17]);
                    _b = __values(plugin.dep.plugin), _c = _b.next();
                    _g.label = 8;
                case 8:
                    if (!!_c.done) return [3 /*break*/, 14];
                    depPlugin = _c.value;
                    _g.label = 9;
                case 9:
                    _g.trys.push([9, 12, , 13]);
                    return [4 /*yield*/, getPkgInfo(ctx, depPlugin)];
                case 10:
                    curPkgInfo = _g.sent();
                    if (!curPkgInfo) {
                        throw "the dependent plugin " + depPlugin + " does not belong to the universal packge";
                    }
                    return [4 /*yield*/, installPlugin(ctx, depPlugin, false)];
                case 11:
                    _g.sent();
                    commandName = toSimpleCommand(curPkgInfo.repoName);
                    if ((oldDependencies === null || oldDependencies === void 0 ? void 0 : oldDependencies.get(curPkgInfo.repoName)) === curPkgInfo.installVersion) {
                        oldDependencies.delete(curPkgInfo.repoName);
                    }
                    universalPkg.depend(pkgInfo.repoName, pkgInfo.installVersion, curPkgInfo.repoName, curPkgInfo.installVersion);
                    // call {pkg}@{version} and disable-check
                    linker.register(pluginBin, pluginLib, commandName + "@" + curPkgInfo.installVersion + " --disable-check", commandName);
                    return [3 /*break*/, 13];
                case 12:
                    e_2 = _g.sent();
                    logger.error("failed to install plugin dependency " + depPlugin);
                    throw e_2;
                case 13:
                    _c = _b.next();
                    return [3 /*break*/, 8];
                case 14: return [3 /*break*/, 17];
                case 15:
                    e_3_1 = _g.sent();
                    e_3 = { error: e_3_1 };
                    return [3 /*break*/, 17];
                case 16:
                    try {
                        if (_c && !_c.done && (_e = _b.return)) _e.call(_b);
                    }
                    finally { if (e_3) throw e_3.error; }
                    return [7 /*endfinally*/];
                case 17:
                    if (oldVersion && oldDependencies) {
                        try {
                            // eslint-disable-next-line no-restricted-syntax
                            for (oldDependencies_1 = __values(oldDependencies), oldDependencies_1_1 = oldDependencies_1.next(); !oldDependencies_1_1.done; oldDependencies_1_1 = oldDependencies_1.next()) {
                                _d = __read(oldDependencies_1_1.value, 2), oldPkg = _d[0], oldPkgVersion = _d[1];
                                universalPkg.removeDepended(oldPkg, oldPkgVersion, pkgInfo.repoName, oldVersion);
                            }
                        }
                        catch (e_4_1) { e_4 = { error: e_4_1 }; }
                        finally {
                            try {
                                if (oldDependencies_1_1 && !oldDependencies_1_1.done && (_f = oldDependencies_1.return)) _f.call(oldDependencies_1);
                            }
                            finally { if (e_4) throw e_4.error; }
                        }
                    }
                    plugin.preInstall.run();
                    linker.register(bin, lib, toSimpleCommand(pkgInfo.repoName));
                    // install when global or not exists
                    if (global || !universalPkg.isInstalled(pkgInfo.repoName)) {
                        universalPkg.install(pkgInfo.repoName, pkgInfo.installVersion);
                    }
                    // the package management information is retained only when the installation is fully successful
                    if (global) {
                        removeInvalidPkg(ctx);
                    }
                    universalPkg.saveChange();
                    plugin.test.runLess();
                    plugin.postInstall.runLess();
                    if (updateFlag) {
                        plugin.postUpgrade.runLess();
                        logger.info('update success');
                    }
                    else {
                        logger.info('install success');
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function toSimpleCommand(command) {
    return command.replace('feflow-plugin-', '');
}
// when you install a universal package, return PkgInfo, otherwise return undefined
function getPkgInfo(ctx, installPlugin) {
    return __awaiter(this, void 0, void 0, function () {
        var installVersion, checkoutTag, repoUrl, repoName, _a, pluginName, pluginVersion, repoInfo;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!isGitRepo(installPlugin)) return [3 /*break*/, 2];
                    repoUrl = installPlugin;
                    installVersion = constant_1.LATEST_VERSION;
                    return [4 /*yield*/, git_1.getTag(repoUrl)];
                case 1:
                    checkoutTag = _b.sent();
                    repoName = getRepoName(repoUrl);
                    return [3 /*break*/, 6];
                case 2:
                    _a = __read(installPlugin.split('@'), 2), pluginName = _a[0], pluginVersion = _a[1];
                    return [4 /*yield*/, getRepoInfo(ctx, pluginName)];
                case 3:
                    repoInfo = _b.sent();
                    repoUrl = repoInfo === null || repoInfo === void 0 ? void 0 : repoInfo.repo;
                    repoName = repoInfo === null || repoInfo === void 0 ? void 0 : repoInfo.name;
                    if (!(isGitRepo(repoUrl) && !(repoInfo === null || repoInfo === void 0 ? void 0 : repoInfo.tnpm))) return [3 /*break*/, 5];
                    if (pluginVersion) {
                        pluginVersion = version_1.default.toFull(pluginVersion);
                        if (!version_1.default.check(pluginVersion)) {
                            throw "invalid version: " + pluginVersion;
                        }
                    }
                    installVersion = pluginVersion || constant_1.LATEST_VERSION;
                    return [4 /*yield*/, git_1.getTag(repoUrl, installVersion === constant_1.LATEST_VERSION ? undefined : installVersion)];
                case 4:
                    checkoutTag = _b.sent();
                    return [3 /*break*/, 6];
                case 5: return [2 /*return*/];
                case 6:
                    if (!repoName) {
                        throw "plugin [" + repoName + "] does not exist";
                    }
                    if (!checkoutTag) {
                        throw "the version [" + installVersion + "] was not found";
                    }
                    return [2 /*return*/, new PkgInfo(repoName, repoUrl, installVersion, checkoutTag)];
            }
        });
    });
}
var PkgInfo = /** @class */ (function () {
    function PkgInfo(repoName, repoUrl, installVersion, checkoutTag) {
        this.repoName = repoName;
        this.repoUrl = repoUrl;
        this.installVersion = installVersion;
        this.checkoutTag = checkoutTag;
    }
    return PkgInfo;
}());
function uninstallUniversalPlugin(ctx, pkgInfo) {
    return __awaiter(this, void 0, void 0, function () {
        var logger, universalPkg, version;
        return __generator(this, function (_a) {
            logger = ctx.logger, universalPkg = ctx.universalPkg;
            version = universalPkg.getInstalled().get(pkgInfo.repoName);
            if (!version) {
                logger.error('this plugin is not currently installed');
                return [2 /*return*/];
            }
            if (pkgInfo.installVersion !== constant_1.LATEST_VERSION
                && pkgInfo.installVersion !== version) {
                logger.error("this version of the plugin is not currently installed, the version you want to uninstall is " + pkgInfo.installVersion + ", The installed version is " + version);
                return [2 /*return*/];
            }
            try {
                universalPkg.uninstall(pkgInfo.repoName, version);
            }
            catch (e) {
                logger.error("uninstall failure, " + e);
                return [2 /*return*/];
            }
            try {
                removeInvalidPkg(ctx);
                logger.info('uninstall success');
            }
            catch (e) {
                logger.info("uninstall succeeded, but failed to clean the data, " + e);
            }
            return [2 /*return*/];
        });
    });
}
function removePkg(ctx, pkg, version) {
    var bin = ctx.bin, lib = ctx.lib, universalPkg = ctx.universalPkg;
    var pluginPath = path_1.default.join(ctx.universalModules, pkg + "@" + version);
    if (fs_1.default.existsSync(pluginPath)) {
        deleteDir(pluginPath);
        if (!universalPkg.isInstalled(pkg)) {
            try {
                new linker_1.default().remove(bin, lib, toSimpleCommand(pkg));
            }
            catch (e) {
                ctx.logger.debug("remove link failure, " + e);
            }
        }
    }
}
function removeInvalidPkg(ctx) {
    var e_5, _a;
    var universalPkg = ctx.universalPkg;
    var invalidDep = universalPkg.removeInvalidDependencies();
    try {
        // eslint-disable-next-line no-restricted-syntax
        for (var invalidDep_1 = __values(invalidDep), invalidDep_1_1 = invalidDep_1.next(); !invalidDep_1_1.done; invalidDep_1_1 = invalidDep_1.next()) {
            var _b = __read(invalidDep_1_1.value, 2), invalidPkg = _b[0], invalidVersion = _b[1];
            removePkg(ctx, invalidPkg, invalidVersion);
        }
    }
    catch (e_5_1) { e_5 = { error: e_5_1 }; }
    finally {
        try {
            if (invalidDep_1_1 && !invalidDep_1_1.done && (_a = invalidDep_1.return)) _a.call(invalidDep_1);
        }
        finally { if (e_5) throw e_5.error; }
    }
}
// update only the plugins installed globally
function updateUniversalPlugin(ctx, pkg, version, plugin) {
    return __awaiter(this, void 0, void 0, function () {
        var universalPkg, dependedOn, dependedOn_1, dependedOn_1_1, _a, dependedOnPkg, dependedOnVersion, e_6_1, newVersion;
        var e_6, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    universalPkg = ctx.universalPkg;
                    dependedOn = universalPkg.getDepended(pkg, version);
                    if (!dependedOn) return [3 /*break*/, 8];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 6, 7, 8]);
                    dependedOn_1 = __values(dependedOn), dependedOn_1_1 = dependedOn_1.next();
                    _c.label = 2;
                case 2:
                    if (!!dependedOn_1_1.done) return [3 /*break*/, 5];
                    _a = __read(dependedOn_1_1.value, 2), dependedOnPkg = _a[0], dependedOnVersion = _a[1];
                    if (dependedOnVersion !== constant_1.LATEST_VERSION) {
                        return [3 /*break*/, 4];
                    }
                    return [4 /*yield*/, updatePlugin(ctx, dependedOnPkg, dependedOnVersion)];
                case 3:
                    _c.sent();
                    _c.label = 4;
                case 4:
                    dependedOn_1_1 = dependedOn_1.next();
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 8];
                case 6:
                    e_6_1 = _c.sent();
                    e_6 = { error: e_6_1 };
                    return [3 /*break*/, 8];
                case 7:
                    try {
                        if (dependedOn_1_1 && !dependedOn_1_1.done && (_b = dependedOn_1.return)) _b.call(dependedOn_1);
                    }
                    finally { if (e_6) throw e_6.error; }
                    return [7 /*endfinally*/];
                case 8:
                    newVersion = universalPkg.getInstalled().get(pkg);
                    if (!(newVersion === version && version === constant_1.LATEST_VERSION && plugin.autoUpdate)) return [3 /*break*/, 10];
                    return [4 /*yield*/, updatePlugin(ctx, pkg, version)];
                case 9:
                    _c.sent();
                    _c.label = 10;
                case 10: return [2 /*return*/];
            }
        });
    });
}
function updatePlugin(ctx, pkg, version) {
    return __awaiter(this, void 0, void 0, function () {
        var universalPkg, isGlobal, e_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    universalPkg = ctx.universalPkg;
                    isGlobal = universalPkg.isInstalled(pkg, version);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, installPlugin(ctx, pkg + "@" + version, isGlobal)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_7 = _a.sent();
                    ctx.logger.error("[" + pkg + "] update failure, " + e_7);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
module.exports.installPlugin = installPlugin;
module.exports.updateUniversalPlugin = updateUniversalPlugin;
module.exports.getRepoInfo = getRepoInfo;
//# sourceMappingURL=install.js.map