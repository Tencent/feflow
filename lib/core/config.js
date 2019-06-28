"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var strip_json_comments_1 = __importDefault(require("strip-json-comments"));
var js_yaml_1 = __importDefault(require("js-yaml"));
var Config = /** @class */ (function () {
    function Config() {
    }
    Config.prototype.loadConfig = function () {
        var directoryPath = process.cwd();
        var configFilenames = [
            ".feflowrc.js",
            ".feflowrc.yaml",
            ".feflowrc.yml",
            ".feflowrc.json",
            ".feflowrc",
            "package.json"
        ];
        for (var _i = 0, configFilenames_1 = configFilenames; _i < configFilenames_1.length; _i++) {
            var filename = configFilenames_1[_i];
            var filePath = path_1.default.join(directoryPath, filename);
            if (fs_1.default.existsSync(filePath)) {
                var configData = void 0;
                try {
                    configData = this.loadConfigFile(filePath);
                }
                catch (error) {
                    if (!error || error.code !== "ESLINT_CONFIG_FIELD_NOT_FOUND") {
                        throw error;
                    }
                }
                if (configData) {
                    console.log("Config file found: " + filePath);
                    console.log('config data', configData);
                    return configData;
                }
            }
        }
        console.log("Config file not found on " + directoryPath);
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
        console.log("Loading JS config file: " + filePath);
        try {
        }
        catch (e) {
            console.log("Error reading JavaScript file: " + filePath);
            e.message = "Cannot read config file: " + filePath + "\nError: " + e.message;
            throw e;
        }
    };
    Config.prototype.loadYAMLConfigFile = function (filePath) {
        console.log("Loading YAML config file: " + filePath);
        try {
            return js_yaml_1.default.safeLoad(this.readFile(filePath)) || {};
        }
        catch (e) {
            console.log("Error reading YAML file: " + filePath);
            e.message = "Cannot read config file: " + filePath + "\nError: " + e.message;
            throw e;
        }
    };
    Config.prototype.loadPackageJSONConfigFile = function (filePath) {
        console.log("Loading package.json config file: " + filePath);
        try {
            var packageData = this.loadJSONConfigFile(filePath);
            if (!Object.hasOwnProperty.call(packageData, "eslintConfig")) {
                throw Object.assign(new Error("package.json file doesn't have 'eslintConfig' field."), { code: "ESLINT_CONFIG_FIELD_NOT_FOUND" });
            }
            return packageData.feflowConfig;
        }
        catch (e) {
            console.log("Error reading package.json file: " + filePath);
            e.message = "Cannot read config file: " + filePath + "\nError: " + e.message;
            throw e;
        }
    };
    Config.prototype.loadJSONConfigFile = function (filePath) {
        console.log("Loading JSON config file: " + filePath);
        try {
            return JSON.parse(strip_json_comments_1.default(this.readFile(filePath)));
        }
        catch (e) {
            console.log("Error reading JSON file: " + filePath);
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
        console.log("Loading legacy config file: " + filePath);
        try {
            return js_yaml_1.default.safeLoad(strip_json_comments_1.default(this.readFile(filePath))) || {};
        }
        catch (e) {
            console.log("Error reading YAML file: %s\n%o", filePath, e);
            e.message = "Cannot read config file: " + filePath + "\nError: " + e.message;
            throw e;
        }
    };
    Config.prototype.readFile = function (filePath) {
        return fs_1.default.readFileSync(filePath, "utf8").replace(/^\ufeff/u, "");
    };
    return Config;
}());
exports.default = Config;
