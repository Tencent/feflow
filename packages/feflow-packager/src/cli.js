"use strict";
exports.__esModule = true;
var chalk_1 = require("chalk");
var minimist_1 = require("minimist");
var semver_1 = require("semver");
var index_1 = require("./index");
var pkg = require('../package.json');
var checkNodeVersion = function (wanted, id) {
    if (!semver_1["default"].satisfies(process.version, wanted)) {
        console.log(chalk_1["default"].red('You are using Node ' + process.version + ', but this version of ' + id +
            ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'));
        process.exit(1);
    }
};
function entry() {
    var args = minimist_1["default"](process.argv.slice(2));
    var requiredVersion = pkg.engines.node;
    checkNodeVersion(requiredVersion, '@feflow/packager');
    var cmd = args._.shift();
    new index_1["default"](cmd).pack();
}
exports["default"] = entry;
//# sourceMappingURL=cli.js.map