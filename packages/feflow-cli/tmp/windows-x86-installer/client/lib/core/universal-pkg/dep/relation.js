"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PkgRelation = void 0;
var base_1 = require("./base");
var PkgRelation = /** @class */ (function () {
    function PkgRelation(oRelation) {
        this.dependencies = base_1.toInstalled(oRelation === null || oRelation === void 0 ? void 0 : oRelation.dependencies);
        this.dependedOn = base_1.toInstalled(oRelation === null || oRelation === void 0 ? void 0 : oRelation.dependedOn);
    }
    return PkgRelation;
}());
exports.PkgRelation = PkgRelation;
//# sourceMappingURL=relation.js.map