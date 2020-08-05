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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var bunyan_1 = require("bunyan");
var chalk_1 = require("chalk");
var stream_1 = require("stream");
var report_1 = require("./report");
var pkg = require('../../../package.json');
var PLUGE_NAME = 'feflow-' + pkg.name.split('/').pop();
var process = require('process');
var timer;
var report = new report_1["default"]();
var levelNames = {
    10: 'Trace',
    20: 'Debug',
    30: 'Info',
    40: 'Warn',
    50: 'Error',
    60: 'Fatal'
};
var levelColors = {
    10: 'gray',
    20: 'gray',
    30: 'green',
    40: 'orange',
    50: 'red',
    60: 'red'
};
var loggerArr = [];
process.on('SIGINT', function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, report.write(loggerArr)];
                case 1:
                    _a.sent();
                    // 操作中断
                    process.exit();
                    return [2 /*return*/];
            }
        });
    });
});
process.on('unhandledRejection', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, report.write(loggerArr)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
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
        return __awaiter(this, void 0, void 0, function () {
            var level, msg, err;
            return __generator(this, function (_a) {
                level = data.level;
                msg = '';
                if (this.debug) {
                    msg += chalk_1["default"].gray(data.time) + ' ';
                }
                msg += chalk_1["default"].keyword(levelColors[level])('[ Feflow' + ' ' + levelNames[level] + ' ]');
                msg += '[ ' + PLUGE_NAME + ' ] ';
                msg += data.msg + '\n';
                if (data.err) {
                    err = data.err.stack || data.err.message;
                    if (err)
                        msg += chalk_1["default"].yellow(err) + '\n';
                }
                loggerArr.push({
                    level: level,
                    msg: "[Feflow " + levelNames[level] + "][" + PLUGE_NAME + "]" + data.msg,
                    date: new Date().getTime()
                });
                if (loggerArr.length > 20) {
                    report.postLogger(loggerArr);
                    loggerArr = [];
                }
                if (level >= 40) {
                    process.stderr.write(msg);
                }
                else {
                    process.stdout.write(msg);
                }
                clearTimeout(timer);
                timer = setTimeout(function () {
                    report.postLogger(loggerArr);
                    loggerArr = [];
                }, 5000);
                callback();
                return [2 /*return*/];
            });
        });
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
    var logger = bunyan_1["default"].createLogger({
        name: options.name || 'feflow',
        streams: streams,
        serializers: {
            err: bunyan_1["default"].stdSerializers.err
        }
    });
    return logger;
}
exports["default"] = createLogger;
//# sourceMappingURL=index.js.map