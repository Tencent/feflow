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
exports.checkoutVersion = exports.getLatestTag = exports.getTag = exports.install = exports.getRegistryUrl = void 0;
var cross_spawn_1 = __importDefault(require("cross-spawn"));
var child_process_1 = __importDefault(require("child_process"));
var util_1 = require("util");
var semver_1 = __importDefault(require("semver"));
var git_1 = require("./git");
function getRegistryUrl(packageManager) {
    return new Promise(function (resolve, reject) {
        var command = packageManager;
        var args = ['config', 'get', 'registry'];
        var child = cross_spawn_1.default(command, args);
        var output = '';
        child.stdout.on('data', function (data) {
            output += data;
        });
        child.stderr.on('data', function (data) {
            output += data;
        });
        child.on('close', function (code) {
            if (code !== 0) {
                reject({
                    command: command + " " + args.join(' '),
                });
                return;
            }
            output = output.replace(/\n/, '').replace(/\/$/, '');
            resolve(output);
        });
    });
}
exports.getRegistryUrl = getRegistryUrl;
function install(packageManager, root, cmd, dependencies, verbose, isOnline) {
    return new Promise(function (resolve, reject) {
        var command = packageManager;
        var args = [cmd, '--save', '--save-exact', '--loglevel', 'error'].concat(dependencies);
        if (verbose) {
            args.push('--verbose');
        }
        var child = cross_spawn_1.default(command, args, { stdio: 'inherit', cwd: root });
        child.on('close', function (code) {
            if (code !== 0) {
                reject({
                    command: command + " " + args.join(' '),
                });
                return;
            }
            resolve();
        });
    });
}
exports.install = install;
function listRepoTag(repoUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var execFile, url, stdout, tagStr, tagList, tagVersionList, i, _a, tagReference, tag;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    execFile = util_1.promisify(child_process_1.default.execFile);
                    return [4 /*yield*/, git_1.transformUrl(repoUrl)];
                case 1:
                    url = _b.sent();
                    return [4 /*yield*/, execFile('git', [
                            'ls-remote',
                            '--tags',
                            '--refs',
                            url,
                        ])];
                case 2:
                    stdout = (_b.sent()).stdout;
                    tagStr = stdout.trim();
                    tagList = [];
                    if (tagStr) {
                        tagVersionList = tagStr.split('\n');
                        if (tagVersionList.length) {
                            for (i = tagVersionList.length - 1; i >= 0; i--) {
                                _a = __read(tagVersionList[i].split('\t'), 2), tagReference = _a[1];
                                // v0.1.2
                                if (/^refs\/tags\/v\d+.\d+.\d+$/i.test(tagReference)) {
                                    tag = tagReference.substring('refs/tags/'.length);
                                    tagList.push(tag);
                                }
                            }
                        }
                    }
                    return [2 /*return*/, tagList];
            }
        });
    });
}
function getTag(repoUrl, version) {
    return __awaiter(this, void 0, void 0, function () {
        var tagList, tagList_1, tagList_1_1, tag;
        var e_1, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, listRepoTag(repoUrl)];
                case 1:
                    tagList = _b.sent();
                    if (tagList.length) {
                        try {
                            // eslint-disable-next-line no-restricted-syntax
                            for (tagList_1 = __values(tagList), tagList_1_1 = tagList_1.next(); !tagList_1_1.done; tagList_1_1 = tagList_1.next()) {
                                tag = tagList_1_1.value;
                                if (!version || version === tag) {
                                    return [2 /*return*/, Promise.resolve(tag)];
                                }
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (tagList_1_1 && !tagList_1_1.done && (_a = tagList_1.return)) _a.call(tagList_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                    }
                    return [2 /*return*/, Promise.reject('no valid tag was found')];
            }
        });
    });
}
exports.getTag = getTag;
function getLatestTag(repoUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var tagList, lastVersion, tagList_2, tagList_2_1, tag;
        var e_2, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, listRepoTag(repoUrl)];
                case 1:
                    tagList = _b.sent();
                    lastVersion = '';
                    if (tagList.length) {
                        try {
                            // eslint-disable-next-line no-restricted-syntax
                            for (tagList_2 = __values(tagList), tagList_2_1 = tagList_2.next(); !tagList_2_1.done; tagList_2_1 = tagList_2.next()) {
                                tag = tagList_2_1.value;
                                if (!lastVersion) {
                                    lastVersion = tag;
                                }
                                else if (semver_1.default.gt(tag, lastVersion)) {
                                    lastVersion = tag;
                                }
                            }
                        }
                        catch (e_2_1) { e_2 = { error: e_2_1 }; }
                        finally {
                            try {
                                if (tagList_2_1 && !tagList_2_1.done && (_a = tagList_2.return)) _a.call(tagList_2);
                            }
                            finally { if (e_2) throw e_2.error; }
                        }
                    }
                    return [2 /*return*/, lastVersion || 'latest'];
            }
        });
    });
}
exports.getLatestTag = getLatestTag;
function checkoutVersion(repoPath, version) {
    return new Promise(function (resolve, reject) {
        var command = 'git';
        cross_spawn_1.default.sync(command, ['-C', repoPath, 'pull'], { stdio: 'ignore' });
        var checkArgs = ['-C', repoPath, 'checkout', version];
        var child = cross_spawn_1.default(command, checkArgs, { stdio: 'ignore' });
        child.on('close', function (code) {
            if (code !== 0) {
                reject({
                    command: command + " " + checkArgs.join(' '),
                    code: code,
                });
                return;
            }
            resolve();
        });
    });
}
exports.checkoutVersion = checkoutVersion;
//# sourceMappingURL=npm.js.map