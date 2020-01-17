"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var js_yaml_1 = __importDefault(require("js-yaml"));
function parseYaml(path) {
    var config;
    if (fs_1.default.existsSync(path)) {
        try {
            config = js_yaml_1.default.safeLoad(fs_1.default.readFileSync(path, 'utf8'));
        }
        catch (e) {
            throw new Error(e);
        }
    }
    return config;
}
exports.parseYaml = parseYaml;
function safeDump(obj, path) {
    var doc;
    try {
        doc = js_yaml_1.default.safeDump(obj, {
            'styles': {
                '!!null': 'canonical'
            },
            'sortKeys': true
        });
    }
    catch (e) {
        throw new Error(e);
    }
    return fs_1.default.writeFileSync(path, doc, 'utf-8');
}
exports.safeDump = safeDump;
//# sourceMappingURL=yaml.js.map