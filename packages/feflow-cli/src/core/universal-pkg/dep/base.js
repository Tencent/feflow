"use strict";
exports.__esModule = true;
exports.toInstalled = void 0;
var version_1 = require("./version");
function toInstalled(oInstalled) {
    var installed = new Map();
    if (!oInstalled) {
        return installed;
    }
    for (var k in oInstalled) {
        var version = oInstalled[k];
        if (version_1["default"].check(version)) {
            installed.set(k, version);
        }
    }
    return installed;
}
exports.toInstalled = toInstalled;
//# sourceMappingURL=base.js.map