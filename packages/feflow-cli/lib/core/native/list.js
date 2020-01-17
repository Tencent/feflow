"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var chalk_1 = __importDefault(require("chalk"));
function loadModuleList(ctx) {
    var packagePath = ctx.rootPkg;
    var pluginDir = path_1.default.join(ctx.root, 'node_modules');
    var extend = function (target, source) {
        for (var obj in source) {
            target[obj] = source[obj];
        }
        return target;
    };
    if (fs_1.default.existsSync(packagePath)) {
        var content = fs_1.default.readFileSync(packagePath, 'utf8');
        var json = JSON.parse(content);
        var deps = extend(json.dependencies || {}, json.devDependencies || {});
        var keys = Object.keys(deps);
        var list = keys.filter(function (name) {
            if (!/^feflow-plugin-|^@[^/]+\/feflow-plugin-|generator-|^@[^/]+\/generator-/.test(name))
                return false;
            var pluginPath = path_1.default.join(pluginDir, name);
            return fs_1.default.existsSync(pluginPath);
        });
        return list;
    }
    else {
        return [];
    }
}
module.exports = function (ctx) {
    ctx.commander.register('list', 'Show all plugins installed.', function () {
        var list = loadModuleList(ctx);
        var templateCnt = 0;
        var pluginCnt = 0;
        console.log('You can search more templates or plugins through https://feflowjs.com/encology/');
        console.log('===============================================');
        if (!list.length) {
            console.log(chalk_1.default.magenta('No templates and plugins have been installed'));
            return;
        }
        console.log('templates');
        list.map(function (name) {
            if (/generator-|^@[^/]+\/generator-/.test(name)) {
                console.log(chalk_1.default.magenta(name));
                templateCnt = 1;
            }
        });
        if (!templateCnt) {
            console.log(chalk_1.default.magenta('No templates have been installed'));
        }
        console.log('plugins');
        list.map(function (name) {
            if (/^feflow-plugin-|^@[^/]+\/feflow-plugin-/.test(name)) {
                console.log(chalk_1.default.magenta(name));
                pluginCnt = 1;
            }
        });
        if (!pluginCnt) {
            console.log(chalk_1.default.magenta('No plugins have been installed'));
        }
    });
};
//# sourceMappingURL=list.js.map