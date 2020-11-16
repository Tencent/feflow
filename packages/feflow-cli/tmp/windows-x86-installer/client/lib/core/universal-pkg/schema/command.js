"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
var base_1 = require("./base");
var child_process_1 = require("child_process");
var valRegexp = new RegExp('\\${var:.*?}', 'ig');
function getVal(symbol) {
    return symbol.substring('${var:'.length, symbol.length - 1);
}
var Command = /** @class */ (function () {
    function Command(ctx, pluginPath, command) {
        this.val = {};
        this.val.pd = pluginPath;
        this.default = base_1.toArray(command === null || command === void 0 ? void 0 : command.default, 'default');
        this.macos = base_1.toArray(command === null || command === void 0 ? void 0 : command.macos, 'macos', this.default);
        this.linux = base_1.toArray(command === null || command === void 0 ? void 0 : command.linux, 'linux', this.default);
        this.windows = base_1.toArray(command === null || command === void 0 ? void 0 : command.windows, 'windows', this.default);
        this.ctx = ctx;
    }
    Command.prototype.getCommands = function () {
        var _this = this;
        var commands = this[base_1.platformType];
        return commands.map(function (c) {
            if (!c || typeof c !== 'string') {
                throw "invalid command: [" + c + "]";
            }
            return c.replace(valRegexp, function (match) {
                var v = getVal(match);
                if (_this.val[v] !== undefined) {
                    return _this.val[v];
                }
                throw "global variable [" + v + "] not currently supported";
            });
        });
    };
    Command.prototype.run = function () {
        var e_1, _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var commands = this.getCommands();
        try {
            // eslint-disable-next-line no-restricted-syntax
            for (var commands_1 = __values(commands), commands_1_1 = commands_1.next(); !commands_1_1.done; commands_1_1 = commands_1.next()) {
                var command = commands_1_1.value;
                if (args && args.length > 0) {
                    command = command + " " + args.join(' ');
                }
                child_process_1.execSync(command, {
                    stdio: 'inherit',
                });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (commands_1_1 && !commands_1_1.done && (_a = commands_1.return)) _a.call(commands_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    // exception not thrown
    Command.prototype.runLess = function () {
        var e_2, _a;
        var commands = this.getCommands();
        try {
            // eslint-disable-next-line no-restricted-syntax
            for (var commands_2 = __values(commands), commands_2_1 = commands_2.next(); !commands_2_1.done; commands_2_1 = commands_2.next()) {
                var command = commands_2_1.value;
                try {
                    child_process_1.execSync(command, {
                        stdio: 'inherit',
                    });
                }
                catch (e) {
                    this.ctx.logger.debug(e);
                    this.ctx.logger.error("[command interrupt] " + e);
                    return;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (commands_2_1 && !commands_2_1.done && (_a = commands_2.return)) _a.call(commands_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    Command.prototype.check = function () {
        var commands;
        switch (base_1.platformType) {
            case 'windows':
                commands = this.windows;
                break;
            case 'linux':
                commands = this.linux;
                break;
            case 'macos':
                commands = this.macos;
                break;
            default:
                commands = [];
        }
        if (commands.length === 0) {
            throw "no command was found for the " + base_1.platformType + " system";
        }
    };
    return Command;
}());
exports.Command = Command;
//# sourceMappingURL=command.js.map