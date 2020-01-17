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
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var import_fresh_1 = __importDefault(require("import-fresh"));
var strip_json_comments_1 = __importDefault(require("strip-json-comments"));
var js_yaml_1 = __importDefault(require("js-yaml"));
var constant_1 = require("../../shared/constant");
var Config = /** @class */ (function () {
    function Config(ctx) {
        this.ctx = ctx;
    }
    Config.prototype.getConfigDirectory = function () {
        var currDir = process.cwd();
        var isConfigExits = function () {
            var e_1, _a;
            try {
                for (var DEVKIT_CONFIG_1 = __values(constant_1.DEVKIT_CONFIG), DEVKIT_CONFIG_1_1 = DEVKIT_CONFIG_1.next(); !DEVKIT_CONFIG_1_1.done; DEVKIT_CONFIG_1_1 = DEVKIT_CONFIG_1.next()) {
                    var filename = DEVKIT_CONFIG_1_1.value;
                    if (fs_1.default.existsSync(path_1.default.join(currDir, filename))) {
                        return true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (DEVKIT_CONFIG_1_1 && !DEVKIT_CONFIG_1_1.done && (_a = DEVKIT_CONFIG_1.return)) _a.call(DEVKIT_CONFIG_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return false;
        };
        while (!isConfigExits()) {
            currDir = path_1.default.join(currDir, '../');
            if (currDir === '/' || /^[a-zA-Z]:\\$/.test(currDir)) {
                return '';
            }
        }
        return currDir;
    };
    Config.prototype.loadConfig = function () {
        var e_2, _a;
        var directoryPath = this.getConfigDirectory();
        try {
            for (var DEVKIT_CONFIG_2 = __values(constant_1.DEVKIT_CONFIG), DEVKIT_CONFIG_2_1 = DEVKIT_CONFIG_2.next(); !DEVKIT_CONFIG_2_1.done; DEVKIT_CONFIG_2_1 = DEVKIT_CONFIG_2.next()) {
                var filename = DEVKIT_CONFIG_2_1.value;
                var filePath = path_1.default.join(directoryPath, filename);
                if (fs_1.default.existsSync(filePath)) {
                    var configData = void 0;
                    try {
                        configData = this.loadConfigFile(filePath);
                    }
                    catch (error) {
                        if (!error || error.code !== "FEFLOW_CONFIG_FIELD_NOT_FOUND") {
                            throw error;
                        }
                    }
                    if (configData) {
                        this.ctx.logger.debug("Config file found: " + filePath);
                        this.ctx.logger.debug('config data', configData);
                        return configData;
                    }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (DEVKIT_CONFIG_2_1 && !DEVKIT_CONFIG_2_1.done && (_a = DEVKIT_CONFIG_2.return)) _a.call(DEVKIT_CONFIG_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        this.ctx.logger.debug("Config file not found.");
        return null;
    };
    Config.prototype.loadConfigFile = function (filePath) {
        switch (path_1.default.extname(filePath)) {
            case ".js":
                return this.loadJSConfigFile(filePath);
            case ".json":
                if (path_1.default.basename(filePath) === "package.json") {
                    return this.loadPackageJSONConfigFile(filePath);
                }
                return this.loadJSONConfigFile(filePath);
            case ".yaml":
            case ".yml":
                return this.loadYAMLConfigFile(filePath);
            default:
                return this.loadLegacyConfigFile(filePath);
        }
    };
    Config.prototype.loadJSConfigFile = function (filePath) {
        this.ctx.logger.debug("Loading JS config file: " + filePath);
        try {
            return import_fresh_1.default(filePath);
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
            return js_yaml_1.default.safeLoad(this.readFile(filePath)) || {};
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
            if (!Object.hasOwnProperty.call(packageData, "feflowConfig")) {
                throw Object.assign(new Error("package.json file doesn't have 'feflowConfig' field."), { code: "FEFLOW_CONFIG_FIELD_NOT_FOUND" });
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
            return JSON.parse(strip_json_comments_1.default(this.readFile(filePath)));
        }
        catch (e) {
            this.ctx.logger.debug("Error reading JSON file: " + filePath);
            e.message = "Cannot read config file: " + filePath + "\nError: " + e.message;
            e.messageTemplate = "failed-to-read-json";
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
            return js_yaml_1.default.safeLoad(strip_json_comments_1.default(this.readFile(filePath))) || {};
        }
        catch (e) {
            this.ctx.logger.debug("Error reading YAML file: %s\n%o", filePath, e);
            e.message = "Cannot read config file: " + filePath + "\nError: " + e.message;
            throw e;
        }
    };
    Config.prototype.readFile = function (filePath) {
        return fs_1.default.readFileSync(filePath, "utf8").replace(/^\ufeff/u, "");
    };
    Config.prototype.getDevKitConfig = function (ctx, cmd) {
        this.ctx = ctx;
        var configData = this.loadConfig();
        var directoryPath = this.getConfigDirectory();
        var kitJson;
        if (configData.devkit && configData.devkit.commands) {
            var commands = configData.devkit.commands;
            var builder = commands[cmd].builder;
            var _a = __read(builder.split(':', 2), 1), packageName = _a[0];
            try {
                var pkgPath = path_1.default.join(directoryPath, 'node_modules', packageName);
                kitJson = require(path_1.default.join(pkgPath, 'devkit.json'));
            }
            catch (error) {
                kitJson = {};
            }
        }
        return kitJson;
    };
    return Config;
}());
exports.default = Config;
//# sourceMappingURL=config.js.map