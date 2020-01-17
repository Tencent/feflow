"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var command_line_usage_1 = __importDefault(require("command-line-usage"));
var getCommands = function (store) {
    var arr = [];
    for (var name_1 in store) {
        var desc = store[name_1].desc;
        arr.push({
            colA: name_1,
            colB: desc
        });
    }
    return arr;
};
var showHelp = function (commands) {
    var sections = [
        {
            header: 'Usage',
            content: '$ fef [options] [command]'
        },
        {
            header: 'Commands',
            content: {
                data: commands,
                options: {
                    maxWidth: 60
                }
            }
        },
        {
            header: 'Options',
            optionList: [
                {
                    name: 'version',
                    description: 'Print version and exit successfully.'
                },
                {
                    name: 'help',
                    description: 'Print this help and exit successfully.'
                }
            ]
        }
    ];
    var usage = command_line_usage_1.default(sections);
    return usage;
};
module.exports = function (ctx) {
    ctx.commander.register('help', 'Help messages', function () {
        var commands = getCommands(ctx.commander.store);
        var usage = showHelp(commands);
        console.log(usage);
    });
};
//# sourceMappingURL=help.js.map