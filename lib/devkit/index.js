"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var resolveBuilder = function (builderStr) {
    var _a = builderStr.split(':', 2), packageName = _a[0], builderName = _a[1];
    if (!builderName) {
        throw new Error('No builder name specified.');
    }
};
function loadDevKit(configData) {
    console.log('config data-', configData);
    var devkit = configData.devkit;
    return function (ctx) {
        for (var cmd in devkit) {
            var builderStr = devkit[cmd].builder;
            var _a = builderStr.split(':', 2), packageName = _a[0], builderName = _a[1];
            var pkgPath = path_1.default.join(process.cwd(), 'node_modules', packageName);
            var kitJson = require(path_1.default.join(pkgPath, 'devkit.json'));
            console.log('kitJson', kitJson);
            var implementation = kitJson.builders[cmd].implementation;
            console.log('implementation=', implementation);
            var handler = path_1.default.join(pkgPath, implementation);
            ctx.commander.register(cmd, 'desc', require(handler));
        }
    };
}
exports.loadDevKit = loadDevKit;
