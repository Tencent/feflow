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
var constant_1 = require("../shared/constant");
var pkg = require('../../package.json');
var checkNodeVersion = function (wanted, id) {
    if (!semver_1.default.satisfies(process.version, wanted)) {
        console.log(chalk_1.default.red("You are using Node " + process.version + ", but this version of " + id + " requires Node " + wanted + ".\nPlease upgrade your Node version."));
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
        verticalLayout: 'default',
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
    var cmd = args._.shift();
    if (!cmd && (args.v || args.version)) {
        feflow.reporter.report('version', args);
        console.log(chalk_1.default.green(pkg.version));
        return;
    }
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
        feflow.cmd = cmd;
        feflow.hook.emit(constant_1.HOOK_TYPE_BEFORE);
        feflow.hook.on(constant_1.EVENT_COMMAND_BEGIN, function () { return feflow
            .call(cmd, feflow)
            .then(function () {
            feflow.hook.emit(constant_1.HOOK_TYPE_AFTER);
            logger.debug("call " + cmd + " success");
        })
            .catch(function (err) {
            handleError(err);
        }); });
    });
}
exports.default = entry;
//# sourceMappingURL=index.js.map