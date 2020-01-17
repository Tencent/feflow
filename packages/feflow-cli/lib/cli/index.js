"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var core_1 = __importDefault(require("../core"));
var figlet_1 = __importDefault(require("figlet"));
var minimist_1 = __importDefault(require("minimist"));
var semver_1 = __importDefault(require("semver"));
var report_1 = __importDefault(require("@feflow/report"));
var pkg = require('../../package.json');
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
var printBanner = function () {
    figlet_1.default.text('feflow', {
        font: '3D-ASCII',
        horizontalLayout: 'default',
        verticalLayout: 'default'
    }, function (err, data) {
        if (err) {
            handleError(err);
        }
        console.log(chalk_1.default.green(data));
        console.log(chalk_1.default.green(" Feflow\uFF0Ccurrent version: v" + pkg.version + ", homepage: https://github.com/Tencent/feflow             "));
        console.log(chalk_1.default.green(' (c) powered by Tencent, aims to improve front end workflow.                                       '));
        console.log(chalk_1.default.green(' Run fef --help to see usage.                                                                      '));
    });
};
function entry() {
    var args = minimist_1.default(process.argv.slice(2));
    var requiredVersion = pkg.engines.node;
    checkNodeVersion(requiredVersion, '@feflow/cli');
    var feflow = new core_1.default(args);
    var commander = feflow.commander, logger = feflow.logger;
    var report = new report_1.default(feflow);
    if (args.v || args.version) {
        report.report('version', args);
        console.log(chalk_1.default.green(pkg.version));
        return;
    }
    var cmd = args._.shift();
    if (!cmd && !args.h && !args.help) {
        printBanner();
        return;
    }
    return feflow.init(cmd).then(function () {
        var isInvalidCmd = !(cmd && (args.h || args.help));
        if (!args.h && !args.help) {
            if (cmd) {
                var c = commander.get(cmd);
                if (!c) {
                    cmd = 'help';
                }
            }
        }
        else if (isInvalidCmd) {
            cmd = 'help';
        }
        report.report(cmd, args);
        return feflow.call(cmd, feflow).then(function () {
            logger.debug("call " + cmd + " success");
        }).catch(function (err) {
            handleError(err);
        });
    });
}
exports.default = entry;
//# sourceMappingURL=index.js.map