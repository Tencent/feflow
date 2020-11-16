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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var chalk_1 = __importDefault(require("chalk"));
var universalPluginRegex = new RegExp('^feflow-(?:devkit|plugin)-(.*)', 'i');
function getModuleVersion(dir, name) {
    var packagePath = path_1.default.resolve(dir, name, 'package.json');
    if (fs_1.default.existsSync(packagePath)) {
        var content = fs_1.default.readFileSync(packagePath, 'utf8');
        var json = JSON.parse(content);
        return (json && json.version) || 'unknown';
    }
    return 'unknown';
}
function loadModuleList(ctx) {
    var packagePath = ctx.rootPkg;
    var pluginDir = path_1.default.join(ctx.root, 'node_modules');
    var extend = function (target, source) {
        // eslint-disable-next-line no-restricted-syntax
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
        }).map(function (key) { return ({
            name: key,
            version: getModuleVersion(pluginDir, key),
        }); });
        return list;
    }
    return [];
}
function loadUniversalPlugin(ctx) {
    var e_1, _a;
    var universalPkg = ctx.universalPkg;
    var availablePluigns = [];
    var pluginsInCommand = ctx.commander.store;
    try {
        // eslint-disable-next-line no-restricted-syntax
        for (var _b = __values(universalPkg.getInstalled()), _c = _b.next(); !_c.done; _c = _b.next()) {
            var _d = __read(_c.value, 2), pkg = _d[0], version = _d[1];
            var _e = __read((universalPluginRegex.exec(pkg) || []), 2), pluginCommand = _e[1];
            if (pluginsInCommand[pluginCommand]) {
                availablePluigns.push({
                    name: pkg,
                    version: version,
                });
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return availablePluigns;
}
module.exports = function (ctx) {
    ctx.commander.register('list', 'Show all plugins installed.', function () {
        var list = loadModuleList(ctx);
        var universalPlugins = loadUniversalPlugin(ctx);
        var templateCnt = 0;
        var pluginCnt = 0;
        list.push.apply(list, __spread(universalPlugins));
        console.log('You can search more templates or plugins through https://feflowjs.com/encology/');
        if (!list.length) {
            console.log(chalk_1.default.magenta('No templates and plugins have been installed'));
            return;
        }
        console.log('templates');
        list.forEach(function (item) {
            if (/generator-|^@[^/]+\/generator-/.test(item.name)) {
                console.log(chalk_1.default.magenta(item.name + "(" + item.version + ")"));
                templateCnt = 1;
            }
        });
        if (!templateCnt) {
            console.log(chalk_1.default.magenta('No templates have been installed'));
        }
        console.log('plugins');
        list.forEach(function (item) {
            if (/^feflow-plugin-|^@[^/]+\/feflow-plugin-/.test(item.name)) {
                console.log(chalk_1.default.magenta(item.name + "(" + item.version + ")"));
                pluginCnt = 1;
            }
        });
        if (!pluginCnt) {
            console.log(chalk_1.default.magenta('No plugins have been installed'));
        }
    });
};
//# sourceMappingURL=list.js.map