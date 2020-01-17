"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cross_spawn_1 = __importDefault(require("cross-spawn"));
function getRegistryUrl(packageManager) {
    return new Promise(function (resolve, reject) {
        var command = packageManager;
        var args = [
            'config',
            'get',
            'registry'
        ];
        var child = cross_spawn_1.default(command, args);
        var output = '';
        child.stdout.on('data', function (data) {
            output += data;
        });
        child.stderr.on('data', function (data) {
            output += data;
        });
        child.on('close', function (code) {
            if (code !== 0) {
                reject({
                    command: command + " " + args.join(' '),
                });
                return;
            }
            output = output.replace(/\n/, '');
            resolve(output);
        });
    });
}
exports.getRegistryUrl = getRegistryUrl;
function install(packageManager, root, cmd, dependencies, verbose, isOnline) {
    return new Promise(function (resolve, reject) {
        var command = packageManager;
        var args = [
            cmd,
            '--save',
            '--save-exact',
            '--loglevel',
            'error',
        ].concat(dependencies);
        if (verbose) {
            args.push('--verbose');
        }
        var child = cross_spawn_1.default(command, args, { stdio: 'inherit', cwd: root });
        child.on('close', function (code) {
            if (code !== 0) {
                reject({
                    command: command + " " + args.join(' '),
                });
                return;
            }
            resolve();
        });
    });
}
exports.install = install;
//# sourceMappingURL=npm.js.map