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
exports.transformUrl = void 0;
var cross_spawn_1 = require("cross-spawn");
var isSSH;
function isSupportSSH(url) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var res, stderr, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (isSSH) {
                        return [2 /*return*/, isSSH];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, Promise.race([
                            cross_spawn_1["default"].sync('ssh', ['-vT', url]),
                            new Promise(function (resolve, reject) {
                                setTimeout(function () {
                                    reject(new Error('SSH check timeout'));
                                }, 1000);
                            })
                        ])];
                case 2:
                    res = _b.sent();
                    stderr = (_a = res === null || res === void 0 ? void 0 : res.stderr) === null || _a === void 0 ? void 0 : _a.toString();
                    if (/Authentication succeeded/.test(stderr)) {
                        isSSH = true;
                    }
                    else {
                        isSSH = false;
                    }
                    return [2 /*return*/, isSSH];
                case 3:
                    err_1 = _b.sent();
                    console.log('Git ssh check timeout, use https');
                    isSSH = false;
                    return [2 /*return*/, isSSH];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getHostname(url) {
    if (/https?/.test(url)) {
        var match = url.match(/^http(s)?:\/\/(.*?)\//);
        return match[2];
    }
    else {
        var match = url.match(/@(.*):/);
        return match[1];
    }
}
var gitAccount;
function transformUrl(url, account) {
    return __awaiter(this, void 0, void 0, function () {
        var hostname, isSSH, transformedUrl, username, password;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hostname = getHostname(url);
                    return [4 /*yield*/, isSupportSSH("git@" + hostname)];
                case 1:
                    isSSH = _a.sent();
                    if (isSSH) {
                        if (/https?/.test(url)) {
                            return [2 /*return*/, url.replace(/https?:\/\//, 'git@').replace(/\//, ':')];
                        }
                        else {
                            return [2 /*return*/, url];
                        }
                    }
                    else {
                        transformedUrl = void 0;
                        if (/https?/.test(url)) {
                            transformedUrl = url;
                        }
                        else {
                            transformedUrl = url.replace("git@" + hostname + ":", "http://" + hostname + "/");
                        }
                        if (account) {
                            gitAccount = account;
                        }
                        if (gitAccount) {
                            username = gitAccount.username, password = gitAccount.password;
                            return [2 /*return*/, transformedUrl.replace(/http:\/\//, "http://" + username + ":" + password + "@")];
                        }
                        return [2 /*return*/, transformedUrl];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.transformUrl = transformUrl;
//# sourceMappingURL=git.js.map