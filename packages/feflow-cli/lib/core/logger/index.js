"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bunyan_1 = __importDefault(require("bunyan"));
var chalk_1 = __importDefault(require("chalk"));
var stream_1 = require("stream");
var levelNames = {
    10: 'TRACE',
    20: 'DEBUG',
    30: 'INFO ',
    40: 'WARN ',
    50: 'ERROR',
    60: 'FATAL'
};
var levelColors = {
    10: 'gray',
    20: 'gray',
    30: 'green',
    40: 'yellow',
    50: 'red',
    60: 'red'
};
var ConsoleStream = /** @class */ (function (_super) {
    __extends(ConsoleStream, _super);
    function ConsoleStream(args) {
        var _this = _super.call(this, {
            objectMode: true
        }) || this;
        _this.debug = Boolean(args.debug);
        return _this;
    }
    ConsoleStream.prototype._write = function (data, enc, callback) {
        var level = data.level;
        var msg = '';
        if (this.debug) {
            msg += chalk_1.default.gray(data.time) + ' ';
        }
        msg += chalk_1.default.keyword(levelColors[level])('Feflow' + ' ' + levelNames[level]) + ' ';
        msg += data.msg + '\n';
        if (data.err) {
            var err = data.err.stack || data.err.message;
            if (err)
                msg += chalk_1.default.yellow(err) + '\n';
        }
        if (level >= 40) {
            process.stderr.write(msg);
        }
        else {
            process.stdout.write(msg);
        }
        callback();
    };
    return ConsoleStream;
}(stream_1.Writable));
function createLogger(options) {
    options = options || {};
    var streams = [];
    if (!options.silent) {
        streams.push({
            type: 'raw',
            level: options.debug ? 'trace' : 'info',
            stream: new ConsoleStream(options)
        });
    }
    if (options.debug) {
        streams.push({
            level: 'trace',
            path: 'debug.log'
        });
    }
    var logger = bunyan_1.default.createLogger({
        name: options.name || 'feflow',
        streams: streams,
        serializers: {
            err: bunyan_1.default.stdSerializers.err
        }
    });
    return logger;
}
exports.default = createLogger;
//# sourceMappingURL=index.js.map