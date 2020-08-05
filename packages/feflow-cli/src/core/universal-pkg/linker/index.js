"use strict";
exports.__esModule = true;
var os_1 = require("os");
var path_1 = require("path");
var fs_1 = require("fs");
/**
 * link your code to system commands
 */
var Linker = /** @class */ (function () {
    function Linker(startCommand) {
        this.startCommand = 'fef';
        this.fileMode = 484;
        this.currentOs = os_1["default"].platform();
        startCommand && (this.startCommand = startCommand);
    }
    /**
     *
     * @param binPath
     * @param libPath
     * @param command it could be checkstyle or checkstyle@v0.0.5
     * @param name    always checkstyle, use command when it does not exist
     */
    Linker.prototype.register = function (binPath, libPath, command, name) {
        if (this.currentOs === 'win32') {
            this.linkToWin32(binPath, command, name);
        }
        else {
            this.linkToUnixLike(binPath, libPath, command, name);
        }
    };
    Linker.prototype.remove = function (binPath, libPath, name) {
        if (this.currentOs === 'win32') {
            this.removeOnWin32(binPath, name);
        }
        else {
            this.removeOnUnixLike(binPath, libPath, name);
        }
    };
    Linker.prototype.removeOnWin32 = function (binPath, name) {
        var cmdFile = this.cmdFile(binPath, name);
        fs_1["default"].unlinkSync(cmdFile);
    };
    Linker.prototype.removeOnUnixLike = function (binPath, libPath, name) {
        var commandLink = path_1["default"].join(binPath, name);
        fs_1["default"].unlinkSync(commandLink);
        var shellFile = this.shellFile(libPath, name);
        fs_1["default"].unlinkSync(shellFile);
    };
    Linker.prototype.linkToWin32 = function (binPath, command, name) {
        this.enableDir(binPath);
        var file = this.cmdFile(binPath, name || command);
        var template = this.cmdTemplate(command);
        this.writeExecFile(file, template);
    };
    Linker.prototype.linkToUnixLike = function (binPath, libPath, command, name) {
        this.enableDir(binPath, libPath);
        var file = this.shellFile(libPath, name || command);
        var template = this.shellTemplate(command);
        var commandLink = path_1["default"].join(binPath, name || command);
        this.writeExecFile(file, template);
        if (fs_1["default"].existsSync(commandLink) && fs_1["default"].statSync(commandLink).isSymbolicLink) {
            return;
        }
        fs_1["default"].symlinkSync(file, commandLink);
    };
    Linker.prototype.writeExecFile = function (file, content) {
        var exists = fs_1["default"].existsSync(file);
        if (exists) {
            try {
                fs_1["default"].accessSync(file, fs_1["default"].constants.X_OK);
            }
            catch (e) {
                fs_1["default"].chmodSync(file, this.fileMode);
            }
        }
        fs_1["default"].writeFileSync(file, content, {
            mode: this.fileMode,
            flag: 'w',
            encoding: 'utf8'
        });
    };
    Linker.prototype.shellTemplate = function (command) {
        return "#!/bin/sh\n" + this.startCommand + " " + command + " $@";
    };
    Linker.prototype.cmdTemplate = function (command) {
        return "@echo off\n" + this.startCommand + " " + command + " %*";
    };
    Linker.prototype.shellFile = function (libPath, name) {
        return path_1["default"].join(libPath, name + ".sh");
    };
    Linker.prototype.cmdFile = function (binPath, name) {
        return path_1["default"].join(binPath, name + ".cmd");
    };
    Linker.prototype.enableDir = function () {
        var dirs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            dirs[_i] = arguments[_i];
        }
        if (!dirs) {
            return;
        }
        dirs.forEach(function (d) {
            if (fs_1["default"].existsSync(d) && fs_1["default"].statSync(d).isFile()) {
                fs_1["default"].unlinkSync(d);
            }
            if (!fs_1["default"].existsSync(d)) {
                fs_1["default"].mkdirSync(d, { recursive: true });
            }
        });
    };
    return Linker;
}());
exports["default"] = Linker;
//# sourceMappingURL=index.js.map