"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toInstalled = void 0;
var version_1 = __importDefault(require("./version"));
function toInstalled(oInstalled) {
    var installed = new Map();
    if (!oInstalled) {
        return installed;
    }
    // eslint-disable-next-line no-restricted-syntax
    for (var k in oInstalled) {
        var version = oInstalled[k];
        if (version_1.default.check(version)) {
            installed.set(k, version);
        }
    }
    return installed;
}
exports.toInstalled = toInstalled;
//# sourceMappingURL=base.js.map