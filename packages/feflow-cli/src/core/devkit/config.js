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
exports.__esModule = true;
var fs_1 = require("fs");
var path_1 = require("path");
var import_fresh_1 = require("import-fresh");
var strip_json_comments_1 = require("strip-json-comments");
var js_yaml_1 = require("js-yaml");
var constant_1 = require("../../shared/constant");
var Config = /** @class */ (function () {
    function Config(ctx) {
        this.ctx = ctx;
    }
    Config.prototype.getProjectDirectory = function () {
        var currDir = process.cwd();
        var isConfigExits = function () {
            var e_1, _a;
            try {
                for (var PROJECT_CONFIG_1 = __values(constant_1.PROJECT_CONFIG), PROJECT_CONFIG_1_1 = PROJECT_CONFIG_1.next(); !PROJECT_CONFIG_1_1.done; PROJECT_CONFIG_1_1 = PROJECT_CONFIG_1.next()) {
                    var filename = PROJECT_CONFIG_1_1.value;
                    if (fs_1["default"].existsSync(path_1["default"].join(currDir, filename))) {
                        return true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (PROJECT_CONFIG_1_1 && !PROJECT_CONFIG_1_1.done && (_a = PROJECT_CONFIG_1["return"])) _a.call(PROJECT_CONFIG_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return false;
        };
        while (!isConfigExits()) {
            currDir = path_1["default"].join(currDir, '../');
            if (currDir === '/' || /^[a-zA-Z]:\\$/.test(currDir)) {
                return '';
            }
        }
        return currDir;
    };
    Config.prototype.loadProjectConfig = function () {
        var directoryPath = this.getProjectDirectory();
        return this.loadConfig(directoryPath, constant_1.PROJECT_CONFIG);
    };
    Config.prototype.loadDevkitConfig = function (directoryPath) {
        return this.loadConfig(directoryPath, constant_1.DEVKIT_CONFIG);
    };
    Config.prototype.loadConfig = function (directoryPath, configArray) {
        var e_2, _a;
        try {
            for (var configArray_1 = __values(configArray), configArray_1_1 = configArray_1.next(); !configArray_1_1.done; configArray_1_1 = configArray_1.next()) {
                var filename = configArray_1_1.value;
                var filePath = path_1["default"].join(directoryPath, filename);
                if (fs_1["default"].existsSync(filePath)) {
                    var configData = void 0;
                    try {
                        configData = this.loadConfigFile(filePath);
                    }
                    catch (error) {
                        if (!error || error.code !== 'FEFLOW_CONFIG_FIELD_NOT_FOUND') {
                            throw error;
                        }
                    }
                    if (configData) {
                        this.ctx.logger.debug('Config file found', filePath);
                        this.ctx.logger.debug('Config data', configData);
                        return configData;
                    }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (configArray_1_1 && !configArray_1_1.done && (_a = configArray_1["return"])) _a.call(configArray_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        this.ctx.logger.debug("Config file not found.");
        return null;
    };
    Config.prototype.loadConfigFile = function (filePath) {
        switch (path_1["default"].extname(filePath)) {
            case '.js':
                return this.loadJSConfigFile(filePath);
            case '.json':
                if (path_1["default"].basename(filePath) === 'package.json') {
                    return this.loadPackageJSONConfigFile(filePath);
                }
                return this.loadJSONConfigFile(filePath);
            case '.yaml':
            case '.yml':
                return this.loadYAMLConfigFile(filePath);
            default:
                return this.loadLegacyConfigFile(filePath);
        }
    };
    Config.prototype.loadJSConfigFile = function (filePath) {
        this.ctx.logger.debug("Loading JS config file: " + filePath);
        try {
            return import_fresh_1["default"](filePath);
        }
        catch (e) {
            this.ctx.logger.debug("Error reading JavaScript file: " + filePath);
            e.message = "Cannot read config file: " + filePath + "\nError: " + e.message;
            throw e;
        }
    };
    Config.prototype.loadYAMLConfigFile = function (filePath) {
        this.ctx.logger.debug("Loading YAML config file: " + filePath);
        try {
            return js_yaml_1["default"].safeLoad(this.readFile(filePath)) || {};
        }
        catch (e) {
            this.ctx.logger.debug("Error reading YAML file: " + filePath);
            e.message = "Cannot read config file: " + filePath + "\nError: " + e.message;
            throw e;
        }
    };
    Config.prototype.loadPackageJSONConfigFile = function (filePath) {
        this.ctx.logger.debug("Loading package.json config file: " + filePath);
        try {
            var packageData = this.loadJSONConfigFile(filePath);
            if (!Object.hasOwnProperty.call(packageData, 'feflowConfig')) {
                throw Object.assign(new Error("package.json file doesn't have 'feflowConfig' field."), { code: 'FEFLOW_CONFIG_FIELD_NOT_FOUND' });
            }
            return packageData.feflowConfig;
        }
        catch (e) {
            this.ctx.logger.debug("Error reading package.json file: " + filePath);
            e.message = "Cannot read config file: " + filePath + "\nError: " + e.message;
            throw e;
        }
    };
    Config.prototype.loadJSONConfigFile = function (filePath) {
        this.ctx.logger.debug("Loading JSON config file: " + filePath);
        try {
            return JSON.parse(strip_json_comments_1["default"](this.readFile(filePath)));
        }
        catch (e) {
            this.ctx.logger.debug("Error reading JSON file: " + filePath);
            e.message = "Cannot read config file: " + filePath + "\nError: " + e.message;
            e.messageTemplate = 'failed-to-read-json';
            e.messageData = {
                path: filePath,
                message: e.message
            };
            throw e;
        }
    };
    Config.prototype.loadLegacyConfigFile = function (filePath) {
        this.ctx.logger.debug("Loading legacy config file: " + filePath);
        try {
            return js_yaml_1["default"].safeLoad(strip_json_comments_1["default"](this.readFile(filePath))) || {};
        }
        catch (e) {
            this.ctx.logger.debug('Error reading YAML file: %s\n%o', filePath, e);
            e.message = "Cannot read config file: " + filePath + "\nError: " + e.message;
            throw e;
        }
    };
    Config.prototype.readFile = function (filePath) {
        return fs_1["default"].readFileSync(filePath, 'utf8').replace(/^\ufeff/u, '');
    };
    return Config;
}());
exports["default"] = Config;
//# sourceMappingURL=config.js.map