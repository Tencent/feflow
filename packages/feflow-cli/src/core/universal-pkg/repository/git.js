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
exports.checkoutVersion = exports.getCurrentTag = exports.getTag = void 0;
var cross_spawn_1 = require("cross-spawn");
var child_process_1 = require("child_process");
var util_1 = require("util");
var version_1 = require("../dep/version");
var git_1 = require("../../../shared/git");
function getTag(repoUrl, version) {
    return __awaiter(this, void 0, void 0, function () {
        var execFile, url, stdout, tagListStr, tagList, satisfiedMaxVersion, tagList_1, tagList_1_1, tagStr, _a, tagReference, tag;
        var e_1, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    execFile = util_1.promisify(child_process_1["default"].execFile);
                    return [4 /*yield*/, git_1.transformUrl(repoUrl)];
                case 1:
                    url = _c.sent();
                    return [4 /*yield*/, execFile('git', [
                            'ls-remote',
                            '--tags',
                            '--refs',
                            url
                        ])];
                case 2:
                    stdout = (_c.sent()).stdout;
                    tagListStr = stdout === null || stdout === void 0 ? void 0 : stdout.trim();
                    if (!tagListStr) {
                        return [2 /*return*/];
                    }
                    tagList = tagListStr.split('\n');
                    try {
                        for (tagList_1 = __values(tagList), tagList_1_1 = tagList_1.next(); !tagList_1_1.done; tagList_1_1 = tagList_1.next()) {
                            tagStr = tagList_1_1.value;
                            _a = __read(tagStr.split('\t'), 2), tagReference = _a[1];
                            tag = tagReference === null || tagReference === void 0 ? void 0 : tagReference.substring('refs/tags/'.length);
                            if (!version_1["default"].check(tag)) {
                                continue;
                            }
                            if (tag === version) {
                                return [2 /*return*/, tag];
                            }
                            if (version && !version_1["default"].satisfies(tag, version)) {
                                continue;
                            }
                            if (!satisfiedMaxVersion || version_1["default"].gt(tag, satisfiedMaxVersion)) {
                                satisfiedMaxVersion = tag;
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (tagList_1_1 && !tagList_1_1.done && (_b = tagList_1["return"])) _b.call(tagList_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    return [2 /*return*/, satisfiedMaxVersion];
            }
        });
    });
}
exports.getTag = getTag;
function getCurrentTag(repoPath) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var status, head, fields, v;
        return __generator(this, function (_b) {
            status = cross_spawn_1["default"].sync('git', ['-C', repoPath, 'status']);
            head = (_a = status === null || status === void 0 ? void 0 : status.stdout) === null || _a === void 0 ? void 0 : _a.toString().trim().split('\n')[0];
            fields = head.split(' ');
            if (fields.length > 0) {
                v = fields[fields.length - 1];
                if (version_1["default"].check(v)) {
                    return [2 /*return*/, v];
                }
            }
            return [2 /*return*/];
        });
    });
}
exports.getCurrentTag = getCurrentTag;
function checkoutVersion(repoPath, version) {
    var command = 'git';
    cross_spawn_1["default"].sync(command, ['-C', repoPath, 'fetch', '--tags', '-f'], { stdio: 'ignore' });
    var checkArgs = ['-C', repoPath, 'checkout', '-f', version];
    return cross_spawn_1["default"].sync(command, checkArgs, { stdio: 'ignore' });
}
exports.checkoutVersion = checkoutVersion;
//# sourceMappingURL=git.js.map