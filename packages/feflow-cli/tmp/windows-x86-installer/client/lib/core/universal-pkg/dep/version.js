"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var semver_1 = __importDefault(require("semver"));
var SemverVersion = /** @class */ (function () {
    function SemverVersion() {
        this.latestVersion = 'latest';
    }
    SemverVersion.prototype.check = function (version) {
        if (typeof version !== 'string') {
            return false;
        }
        if (version === this.latestVersion) {
            return true;
        }
        return /^v(0|[1-9]\d*).(0|[1-9]\d*).(0|[1-9]\d*)$/i.test(version);
    };
    SemverVersion.prototype.valid = function (version) {
        if (/^v.*/i.test(version)) {
            return version.substring(1);
        }
        return version;
    };
    SemverVersion.prototype.toFull = function (version) {
        if (!this.check(version)) {
            var fullVersion = "v" + version;
            if (this.check(fullVersion)) {
                return fullVersion;
            }
        }
        return version;
    };
    SemverVersion.prototype.satisfies = function (version, range) {
        return semver_1.default.satisfies(this.valid(version), this.valid(range));
    };
    SemverVersion.prototype.gt = function (v1, v2) {
        return semver_1.default.gt(this.valid(v1), this.valid(v2));
    };
    return SemverVersion;
}());
exports.default = new SemverVersion();
//# sourceMappingURL=version.js.map