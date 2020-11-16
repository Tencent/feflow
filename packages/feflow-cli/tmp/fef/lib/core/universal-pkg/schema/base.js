"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toArray = exports.platformType = exports.platform = void 0;
var os_1 = __importDefault(require("os"));
var platformMap = {
    aix: 'linux',
    freebsd: 'linux',
    linux: 'linux',
    openbsd: 'linux',
    sunos: 'linux',
    win32: 'windows',
    darwin: 'macos',
};
var platform = os_1.default.platform();
exports.platform = platform;
var platformType = platformMap[platform];
exports.platformType = platformType;
function toArray(v, field, defaultV) {
    if (v && !Array.isArray(v)) {
        if (typeof v === 'string') {
            return [v];
        }
        throw "field " + field + " must provide either a string or an array of strings";
    }
    return v || defaultV || [];
}
exports.toArray = toArray;
//# sourceMappingURL=base.js.map