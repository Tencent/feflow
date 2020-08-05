"use strict";
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
exports.getProject = exports.getSystemInfo = exports.getProjectByGit = exports.getProjectByPackage = exports.getUserName = exports.getGitStatus = exports.sshRegex = exports.httpRegex = void 0;
var os_1 = require("os");
var path_1 = require("path");
var fs_1 = require("fs");
var objectFactory_1 = require("./objectFactory");
var child_process_1 = require("child_process");
var platform = os_1["default"].platform();
var isWin = platform === 'win32';
var isMac = platform === 'darwin';
var cwd = process.cwd();
exports.httpRegex = /^https?\:\/\/(?:[^\/]+)\/([^\/]+)\/([^\/.]+)(?:\.git)?/;
exports.sshRegex = /^git@(?:[^\:]+)\:([^\/]+)\/([^\/\.]+)(?:\.git)?/;
var exec = function (command) {
    var result = '';
    try {
        result = child_process_1.execSync(command)
            .toString()
            .replace(/\n/, '');
    }
    catch (err) { }
    return result;
};
exports.getGitStatus = function () {
    var hasGitCommand = exec('which git');
    var hasGitDir = fs_1["default"].existsSync(path_1["default"].join(cwd, '.git'));
    return hasGitCommand && hasGitDir;
};
var isGitAvailable = exports.getGitStatus();
var getUserNameFromHostName = function () {
    var hostname = os_1["default"].hostname();
    var _a = __read(hostname.split('-')), upperUserName = _a[0], device = _a.slice(1);
    return upperUserName.toLowerCase();
};
var getUserNameFromLinux = function () {
    var nameFromLinux = exec('whoami');
    if (nameFromLinux === 'root') {
        return '';
    }
    return nameFromLinux;
};
var getUserNameFromGit = function () {
    if (!isGitAvailable) {
        return '';
    }
    var nameFromLinux = exec('git config user.name');
    return nameFromLinux;
};
exports.getUserName = function () {
    // mac/window
    if (isMac || isWin) {
        return getUserNameFromHostName() || getUserNameFromGit();
    }
    return getUserNameFromLinux() || getUserNameFromGit() || getUserNameFromHostName();
};
exports.getProjectByPackage = function () {
    var project = '';
    var pkgPath = path_1["default"].resolve(process.cwd(), './package.json');
    if (fs_1["default"].existsSync(pkgPath)) {
        project = require(pkgPath).name;
    }
    return project;
};
exports.getProjectByGit = function (url) {
    var project = '';
    var gitRemoteUrl = url || exec('git remote get-url origin');
    var urlRegex;
    if (exports.httpRegex.test(gitRemoteUrl)) {
        urlRegex = exports.httpRegex;
    }
    else if (exports.sshRegex.test(gitRemoteUrl)) {
        urlRegex = exports.sshRegex;
    }
    if (!urlRegex)
        return '';
    var _a = __read(urlRegex.exec(gitRemoteUrl) || [], 3), _ = _a[0], group = _a[1], path = _a[2];
    project = group ? group + "/" + path : '';
    return project;
};
exports.getSystemInfo = function () {
    var systemDetailInfo = objectFactory_1["default"]
        .create()
        .load('hostname', os_1["default"].hostname())
        .load('type', os_1["default"].type())
        .load('platform', os_1["default"].platform())
        .load('arch', os_1["default"].arch())
        .load('release', os_1["default"].release())
        .done();
    return JSON.stringify(systemDetailInfo);
};
exports.getProject = function (ctx, local) {
    var pkgConfig = ctx.pkgConfig || {};
    var project = '';
    if (pkgConfig.name && !local) {
        // feflow context
        project = pkgConfig.name;
    }
    else {
        try {
            // if not, read project name from project's package.json or git
            project = exports.getProjectByPackage();
            if (!project && isGitAvailable) {
                project = exports.getProjectByGit();
            }
        }
        catch (error) { }
    }
    return project;
};
//# sourceMappingURL=utils.js.map