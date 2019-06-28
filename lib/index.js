"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var minimist_1 = __importDefault(require("minimist"));
var semver_1 = __importDefault(require("semver"));
var core_1 = __importDefault(require("./core"));
var pkg = require('../package.json');
var checkNodeVersion = function (wanted, id) {
    if (!semver_1.default.satisfies(process.version, wanted)) {
        console.log(chalk_1.default.red('You are using Node ' + process.version + ', but this version of ' + id +
            ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'));
        process.exit(1);
    }
};
var handleError = function (err) {
    if (err) {
        console.log(chalk_1.default.red(err));
    }
    process.exit(2);
};
function entry() {
    var args = minimist_1.default(process.argv.slice(2));
    var requiredVersion = pkg.engines.node;
    checkNodeVersion(requiredVersion, 'feflow-cli');
    var feflow = new core_1.default(args);
    return feflow.init().then(function () {
        var cmd = '';
        if (args.v || args.version) {
            console.log(chalk_1.default.green(pkg.version));
            return;
        }
        else {
            cmd = args._.shift();
            return feflow.call(cmd, args).then(function () {
                console.log('success!');
            }).catch(function (err) {
                handleError(err);
            });
        }
    });
}
exports.default = entry;
