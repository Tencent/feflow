"use strict";
exports.__esModule = true;
var logger_1 = require("../../../src/core/logger");
var captureStream = function (stream) {
    var oldWrite = stream.write;
    var buf = '';
    stream.write = function (chunk, encoding, callback) {
        buf += chunk.toString();
        oldWrite.apply(stream, arguments);
    };
    return {
        unhook: function () {
            stream.write = oldWrite;
        },
        captured: function () {
            return buf;
        }
    };
};
describe('@feflow/core - Logger system', function () {
    var hook;
    beforeEach(function () {
        hook = captureStream(process.stderr);
    });
    afterEach(function () {
        hook.unhook();
    });
    it('test debug and silent', function () {
        var log = logger_1["default"]({
            debug: true,
            silent: true
        });
        log.debug('hello feflow');
    });
    it('test no debug and silent', function () {
        var log = logger_1["default"]({});
        log.info('hello feflow');
    });
    it('test debug', function () {
        var log = logger_1["default"]({
            debug: true,
            silent: false
        });
        log.debug('hello feflow');
    });
    it('test warn', function () {
        var log = logger_1["default"]({
            debug: true,
            silent: false
        });
        log.warn('hello feflow');
    });
    it('test error', function () {
        var log = logger_1["default"]({
            debug: true,
            silent: false
        });
        log.error('hello feflow');
    });
});
//# sourceMappingURL=index.test.js.map