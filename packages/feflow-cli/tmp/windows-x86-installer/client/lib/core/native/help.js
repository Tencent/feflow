"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var command_line_usage_1 = __importDefault(require("command-line-usage"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var chalk_1 = __importDefault(require("chalk"));
var cross_spawn_1 = __importDefault(require("cross-spawn"));
var constant_1 = require("../../shared/constant");
var getCommands = function (store) {
    var arr = [];
    // eslint-disable-next-line no-restricted-syntax
    for (var name_1 in store) {
        var desc = store[name_1].desc;
        arr.push({
            colA: name_1,
            colB: desc,
        });
    }
    return arr;
};
var showHelp = function (commands) {
    var sections = [
        {
            header: 'Usage',
            content: '$ fef [options] [command]',
        },
        {
            header: 'Commands',
            content: {
                data: commands,
                options: {
                    maxWidth: 60,
                },
            },
        },
        {
            header: 'Options',
            optionList: [
                {
                    name: 'version',
                    description: 'Print version and exit successfully.',
                },
                {
                    name: 'help',
                    description: 'Print this help and exit successfully.',
                },
                {
                    name: 'disable-check',
                    description: 'Disable @feflow/cli and installed plugins check update',
                },
                {
                    name: 'auto-update',
                    description: 'Auto update @feflow/cli and installed plugins',
                },
            ],
        },
    ];
    var usage = command_line_usage_1.default(sections);
    return usage;
};
var parseReadme = function (path) {
    var readmeText;
    if (fs_1.default.existsSync(path)) {
        try {
            readmeText = fs_1.default.readFileSync(path, 'utf8');
        }
        catch (e) {
            throw new Error(e);
        }
    }
    return readmeText;
};
module.exports = function (ctx) {
    ctx.commander.register('help', 'Help messages', function () {
        var store = ctx.commander.store;
        var _a = __read(ctx.args._, 1), cmd = _a[0];
        cmd = cmd && String.prototype.toLowerCase.call(cmd);
        // fef help xxx 的 case
        if (cmd) {
            if (Object.prototype.hasOwnProperty.call(store, cmd)) {
                var commandInfo = store[cmd];
                // 优先展示组件注册信息
                if (commandInfo.options && commandInfo.options.length) {
                    var _b = __read(commandInfo.options, 1), _c = _b[0], type = _c.type, content = _c.content;
                    // case 1: 多语言情况下 yml 有 usage 属性时，执行对应的内容
                    if (type === 'usage') {
                        cross_spawn_1.default(content, {
                            stdio: 'inherit',
                            shell: true,
                        });
                        return;
                    }
                    // case 2: 多语言情况下 yml 没有 usage 属性时，优先读取 readme 展示出来
                    if (type === 'path') {
                        var pluginConfigPath = path_1.default.join(content, constant_1.UNIVERSAL_README_CONFIG);
                        var readmeText = parseReadme(pluginConfigPath);
                        if (readmeText) {
                            console.log(chalk_1.default.yellow("No usage was found in command '" + cmd + "'. Below is the README.md"));
                            console.log(readmeText);
                            return;
                        }
                        // case 3: 多语言情况下既没有 usage，又没有 README.md，则展示插件的 desc
                        console.log(chalk_1.default.yellow("No usage was found in command '" + cmd + "'. Below is the description."));
                        console.log(commandInfo.desc);
                        return;
                    }
                    // case 4: nodejs 且有写 options 的情况
                    var usage_1 = command_line_usage_1.default(commandInfo.options);
                    console.log(usage_1);
                    return;
                }
                // case 5: nodejs 且没有写 options 的情况，直接展示插件的 desc
                console.log(chalk_1.default.yellow("No usage was found in command '" + cmd + "'. Below is the description."));
                console.log(commandInfo.desc);
                return;
            }
            console.log(chalk_1.default.yellow("Command '" + cmd + "' not found in feflow. You need to install it first."));
            console.log('Below is the usage of feflow.');
        }
        // 打印 fef 的 usage
        var commands = getCommands(ctx.commander.store);
        var usage = showHelp(commands);
        console.log(usage);
        return;
    });
};
//# sourceMappingURL=help.js.map