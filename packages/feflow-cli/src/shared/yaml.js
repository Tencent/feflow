"use strict";
exports.__esModule = true;
exports.safeDump = exports.parseYaml = void 0;
var fs_1 = require("fs");
var js_yaml_1 = require("js-yaml");
function parseYaml(path) {
    var config;
    if (fs_1["default"].existsSync(path)) {
        try {
            config = js_yaml_1["default"].safeLoad(fs_1["default"].readFileSync(path, 'utf8'));
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
        doc = js_yaml_1["default"].safeDump(obj, {
            styles: {
                '!!null': 'canonical'
            },
            sortKeys: true
        });
    }
    catch (e) {
        throw new Error(e);
    }
    return fs_1["default"].writeFileSync(path, doc, 'utf-8');
}
exports.safeDump = safeDump;
//# sourceMappingURL=yaml.js.map