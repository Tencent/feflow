"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var applyPlugins_1 = __importDefault(require("./applyPlugins"));
function loadPlugins(ctx) {
    var root = ctx.root, rootPkg = ctx.rootPkg;
    return new Promise(function (resolve, reject) {
        fs_1.default.readFile(rootPkg, 'utf8', function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                var json = JSON.parse(data);
                var deps = json.dependencies || json.devDependencies || {};
                var plugins = Object.keys(deps).filter(function (name) {
                    if (!/^feflow-plugin-|^@[^/]+\/feflow-plugin-/.test(name)) {
                        return false;
                    }
                    var pluginPath = path_1.default.join(root, 'node_modules', name);
                    return fs_1.default.existsSync(pluginPath);
                });
                applyPlugins_1.default(plugins)(ctx);
                resolve();
            }
        });
    });
}
exports.default = loadPlugins;
//# sourceMappingURL=loadPlugins.js.map