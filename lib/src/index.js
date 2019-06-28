"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var minimist_1 = __importDefault(require("minimist"));
var semver_1 = __importDefault(require("semver"));
var core_1 = __importDefault(require("./core"));
var package_json_1 = __importDefault(require("../package.json"));
var checkNodeVersion = function (wanted, id) {
    if (!semver_1.default.satisfies(process.version, wanted)) {
        console.log(chalk_1.default.red('You are using Node ' + process.version + ', but this version of ' + id +
            ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'));
        process.exit(1);
    }
};
function entry() {
    var args = minimist_1.default(process.argv.slice(2));
    var requiredVersion = package_json_1.default.engines.node;
    console.log(requiredVersion);
    checkNodeVersion(requiredVersion, 'feflow-cli');
    var feflow = new core_1.default(args);
}
exports.default = entry;
