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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var os_1 = __importDefault(require("os"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var cross_spawn_1 = __importDefault(require("cross-spawn"));
var osenv_1 = __importDefault(require("osenv"));
/**
 * register the directory to the environment variable path
 */
var Binp = /** @class */ (function () {
    function Binp() {
        this.currentOs = os_1.default.platform();
    }
    Binp.prototype.register = function (binPath, prior, temporary) {
        if (prior === void 0) { prior = false; }
        if (temporary === void 0) { temporary = false; }
        if (this.isRegisted(binPath)) {
            return;
        }
        if (temporary) {
            var newPath = void 0;
            if (prior) {
                newPath = "" + binPath + path_1.default.delimiter + process.env.PATH;
            }
            else {
                newPath = "" + process.env.PATH + path_1.default.delimiter + binPath;
            }
            process.env.PATH = newPath;
            return;
        }
        if (this.currentOs === 'win32') {
            this.registerToWin32(binPath, prior);
        }
        else {
            var profile = this.checkTerminal(binPath, prior);
            if (profile) {
                this.registerToUnixLike(binPath, prior);
                this.handleUnsupportedTerminal(profile);
            }
        }
    };
    Binp.prototype.isRegisted = function (binPath) {
        var pathStr = process.env.PATH;
        var pathList = [];
        if (pathStr) {
            pathList = pathStr.split(path_1.default.delimiter);
        }
        return pathList.includes(binPath);
    };
    Binp.prototype.registerToWin32 = function (binPath, prior) {
        var pathStr = process.env.PATH;
        var toPath;
        if (prior) {
            toPath = binPath + ";" + pathStr;
        }
        else {
            toPath = pathStr + ";" + binPath;
        }
        cross_spawn_1.default.sync('setx', ['path', toPath, '/m'], { stdio: 'ignore' });
    };
    Binp.prototype.registerToUnixLike = function (binPath, prior) {
        var toPath;
        if (prior) {
            toPath = "export PATH=" + binPath + ":$PATH";
        }
        else {
            toPath = "export PATH=$PATH:" + binPath;
        }
        var home = osenv_1.default.home();
        var zshProfile = this.detectZshProfile(home);
        this.addToPath(zshProfile, toPath);
        var bashProfile = this.detectBashProfile(home);
        this.addToPath(bashProfile, toPath);
        if (prior) {
            toPath = "set path = (" + binPath + " $path)";
        }
        else {
            toPath = "set path = ($path " + binPath + ")";
        }
        var cshProfile = this.detectCshProfile(home);
        this.addToPath(cshProfile, toPath);
    };
    Binp.prototype.checkTerminal = function (binPath, prior) {
        var _a;
        var _b = __read(this.detectProfile(binPath, prior), 2), profile = _b[0], setStatement = _b[1];
        if (!profile || !setStatement) {
            console.warn("unknown terminal, please add " + binPath + " to the path");
            return;
        }
        var content = (_a = fs_1.default.readFileSync(profile)) === null || _a === void 0 ? void 0 : _a.toString();
        if ((content === null || content === void 0 ? void 0 : content.indexOf(setStatement)) === -1) {
            return profile;
        }
        this.handleUnsupportedTerminal(profile);
    };
    Binp.prototype.handleUnsupportedTerminal = function (profile) {
        console.error('the current terminal cannot use feflow normally, please open a new terminal or execute the following statement:');
        console.error("source " + profile);
        process.exit(1);
    };
    Binp.prototype.detectProfile = function (binPath, prior) {
        var _a;
        var home = osenv_1.default.home();
        var shell = process.env.SHELL;
        var toPath;
        if (prior) {
            toPath = "export PATH=" + binPath + ":$PATH";
        }
        else {
            toPath = "export PATH=$PATH:" + binPath;
        }
        if (!shell) {
            return [undefined, undefined];
        }
        var shellMatch = shell.match(/(zsh|bash|sh|zcsh|csh)/);
        var shellType = '';
        if (Array.isArray(shellMatch) && shellMatch.length > 0) {
            _a = __read(shellMatch, 1), shellType = _a[0];
        }
        switch (shellType) {
            case 'zsh':
                return [this.detectZshProfile(home), toPath];
            case 'bash':
            case 'sh':
                return [this.detectBashProfile(home), toPath];
            case 'zcsh':
            case 'csh':
                if (prior) {
                    toPath = "set path = (" + binPath + " $path)";
                }
                else {
                    toPath = "set path = ($path " + binPath + ")";
                }
                return [this.detectCshProfile(home), toPath];
        }
        return [undefined, undefined];
    };
    Binp.prototype.detectBashProfile = function (home) {
        if (this.currentOs === 'darwin') {
            return path_1.default.join(home, '.bash_profile');
        }
        return path_1.default.join(home, '.bashrc');
    };
    Binp.prototype.detectCshProfile = function (home) {
        return path_1.default.join(home, '.tcshrc');
    };
    Binp.prototype.detectZshProfile = function (home) {
        return path_1.default.join(home, '.zshrc');
    };
    Binp.prototype.addToPath = function (file, content) {
        fs_1.default.appendFileSync(file, "\n" + content + "\n");
    };
    return Binp;
}());
exports.default = Binp;
//# sourceMappingURL=index.js.map