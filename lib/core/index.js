"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = __importDefault(require("./commander"));
var logger_1 = __importDefault(require("./logger"));
var plugin_1 = require("../plugin");
var devkit_1 = require("../devkit");
var config_1 = __importDefault(require("./config"));
var pkg = require('../package.json');
var Feflow = /** @class */ (function () {
    function Feflow(args) {
        args = args || {};
        this.version = pkg.version;
        this.commander = new commander_1.default();
        this.logger = logger_1.default({
            debug: Boolean(args.debug),
            silent: Boolean(args.silent)
        });
    }
    Feflow.prototype.init = function () {
        var _this = this;
        return plugin_1.loadPlugins().then(function (plugins) {
            plugin_1.applyPlugins(plugins)(_this);
        }).then(function () {
            var config = new config_1.default();
            var configData = config.loadConfig();
            devkit_1.loadDevKit(configData)(_this);
            console.log('init success');
        });
    };
    Feflow.prototype.call = function (name, args) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var cmd = _this.commander.get(name);
            if (cmd) {
                cmd.call(_this, args).then(resolve, reject);
            }
            else {
                reject(new Error('Command `' + name + '` has not been registered yet!'));
            }
        });
    };
    return Feflow;
}());
exports.default = Feflow;
