"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UpgradeUniq = /** @class */ (function () {
    function UpgradeUniq() {
        this.container = new Map();
    }
    UpgradeUniq.prototype.upgradeable = function (pkg, version) {
        var ret = this.container.get(pkg) !== version;
        if (ret) {
            this.container.set(pkg, version);
        }
        return ret;
    };
    return UpgradeUniq;
}());
exports.default = UpgradeUniq;
//# sourceMappingURL=uniq.js.map