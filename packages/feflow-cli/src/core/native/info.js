"use strict";
exports.__esModule = true;
var os_1 = require("os");
module.exports = function (ctx) {
    ctx.commander.register('info', 'Info messages', function () {
        var versions = process.versions;
        var keys = Object.keys(versions);
        var key = '';
        console.log('feflow:', ctx.version);
        console.log('os:', os_1["default"].type(), os_1["default"].release(), os_1["default"].platform(), os_1["default"].arch());
        for (var i = 0, len = keys.length; i < len; i++) {
            key = keys[i];
            console.log('%s: %s', key, versions[key]);
        }
    });
};
//# sourceMappingURL=info.js.map