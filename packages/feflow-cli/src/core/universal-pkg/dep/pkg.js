"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
exports.__esModule = true;
exports.UniversalPkg = void 0;
var relation_1 = require("./relation");
var fs_1 = require("fs");
var base_1 = require("./base");
var version_1 = require("./version");
var path_1 = require("path");
var UniversalPkg = /** @class */ (function () {
    function UniversalPkg(pkgFile) {
        this.version = '0.0.0';
        // pkg: version
        this.installed = new Map();
        this.dependencies = new Map();
        this.pkgFile = pkgFile;
        if (!fs_1["default"].existsSync(pkgFile)) {
            this.saveChange();
            return;
        }
        var universalPkg = require(pkgFile);
        this.version = (universalPkg === null || universalPkg === void 0 ? void 0 : universalPkg.version) || this.version;
        this.installed = base_1.toInstalled(universalPkg === null || universalPkg === void 0 ? void 0 : universalPkg.installed);
        this.dependencies = this.toDependencies(universalPkg === null || universalPkg === void 0 ? void 0 : universalPkg.dependencies);
    }
    UniversalPkg.prototype.toDependencies = function (oDependencies) {
        var dependencies = new Map();
        if (!oDependencies) {
            return dependencies;
        }
        for (var pkg in oDependencies) {
            var versionRelationMap = oDependencies[pkg];
            if (!versionRelationMap) {
                continue;
            }
            var pkgRelation = new Map();
            for (var version in versionRelationMap) {
                var oVersionRelation = versionRelationMap[version];
                if (version_1["default"].check(version)) {
                    pkgRelation.set(version, new relation_1.PkgRelation(oVersionRelation));
                }
            }
            if (pkgRelation.size > 0) {
                dependencies.set(pkg, pkgRelation);
            }
        }
        return dependencies;
    };
    UniversalPkg.prototype.getInstalled = function () {
        return this.installed;
    };
    UniversalPkg.prototype.isInstalled = function (pkg, version, includeDep) {
        if (!version && !includeDep) {
            return this.installed.has(pkg);
        }
        if (version && includeDep) {
            return this.getPkgRelation(pkg, version) !== undefined;
        }
        else {
            var v = this.installed.get(pkg);
            if (v && version === v) {
                return true;
            }
        }
        return false;
    };
    UniversalPkg.prototype.install = function (pkg, version) {
        this.installed.set(pkg, version);
        var versionMap = this.dependencies.get(pkg);
        if (!versionMap) {
            versionMap = new Map();
        }
        var r = versionMap.get(version);
        if (!r) {
            r = new relation_1.PkgRelation(null);
        }
        versionMap.set(version, r);
        this.dependencies.set(pkg, versionMap);
    };
    UniversalPkg.prototype.isDepdenedOnOther = function (pkg, version) {
        var vRelation = this.dependencies.get(pkg);
        if (vRelation) {
            var r = vRelation.get(version);
            if (r && r.dependedOn.size > 0) {
                return true;
            }
        }
        return false;
    };
    UniversalPkg.prototype.depend = function (pkg, version, dependPkg, dependPkgVersion) {
        var versionMap = this.dependencies.get(pkg);
        if (!versionMap) {
            versionMap = new Map();
        }
        var r = versionMap.get(version);
        if (!r) {
            r = new relation_1.PkgRelation(null);
        }
        r.dependencies.set(dependPkg, dependPkgVersion);
        versionMap.set(version, r);
        this.dependencies.set(pkg, versionMap);
        this.dependedOn(dependPkg, dependPkgVersion, pkg, version);
    };
    UniversalPkg.prototype.removeInvalidDependencies = function () {
        var e_1, _a, e_2, _b, e_3, _c;
        var invalidDep = [];
        try {
            for (var _d = __values(this.dependencies), _e = _d.next(); !_e.done; _e = _d.next()) {
                var _f = __read(_e.value, 2), pkg = _f[0], versionRelation = _f[1];
                try {
                    for (var versionRelation_1 = (e_2 = void 0, __values(versionRelation)), versionRelation_1_1 = versionRelation_1.next(); !versionRelation_1_1.done; versionRelation_1_1 = versionRelation_1.next()) {
                        var _g = __read(versionRelation_1_1.value, 1), version = _g[0];
                        if (!this.isValid(pkg, version)) {
                            invalidDep.push([pkg, version]);
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (versionRelation_1_1 && !versionRelation_1_1.done && (_b = versionRelation_1["return"])) _b.call(versionRelation_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d["return"])) _a.call(_d);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var invalidDep_1 = __values(invalidDep), invalidDep_1_1 = invalidDep_1.next(); !invalidDep_1_1.done; invalidDep_1_1 = invalidDep_1.next()) {
                var _h = __read(invalidDep_1_1.value, 2), pkg = _h[0], version = _h[1];
                var versionRelation = this.dependencies.get(pkg);
                if (versionRelation) {
                    versionRelation["delete"](version);
                    if (versionRelation.size === 0) {
                        this.dependencies["delete"](pkg);
                    }
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (invalidDep_1_1 && !invalidDep_1_1.done && (_c = invalidDep_1["return"])) _c.call(invalidDep_1);
            }
            finally { if (e_3) throw e_3.error; }
        }
        this.saveChange();
        return invalidDep;
    };
    UniversalPkg.prototype.isValid = function (pkg, version) {
        var e_4, _a;
        if (this.isInstalled(pkg, version)) {
            return true;
        }
        var depended = this.getDepended(pkg, version);
        if (!depended || depended.size === 0) {
            return false;
        }
        try {
            for (var depended_1 = __values(depended), depended_1_1 = depended_1.next(); !depended_1_1.done; depended_1_1 = depended_1.next()) {
                var _b = __read(depended_1_1.value, 2), dependedPkg = _b[0], dependedVersion = _b[1];
                if (this.isValid(dependedPkg, dependedVersion)) {
                    return true;
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (depended_1_1 && !depended_1_1.done && (_a = depended_1["return"])) _a.call(depended_1);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return false;
    };
    UniversalPkg.prototype.removeDepend = function (pkg, version, dependPkg, dependPkgVersion) {
        var dependencies = this.getDependencies(pkg, version);
        if (dependencies) {
            dependencies["delete"](dependPkg);
        }
        var depended = this.getDepended(dependPkg, dependPkgVersion);
        if (depended) {
            depended["delete"](pkg);
        }
        return depended ? depended.size : 0;
    };
    UniversalPkg.prototype.dependedOn = function (pkg, version, dependedOnPkg, dependedOnPkgVersion) {
        var versionMap = this.dependencies.get(pkg);
        if (!versionMap) {
            versionMap = new Map();
        }
        var r = versionMap.get(version);
        if (!r) {
            r = new relation_1.PkgRelation(null);
        }
        r.dependedOn.set(dependedOnPkg, dependedOnPkgVersion);
        versionMap.set(version, r);
        this.dependencies.set(pkg, versionMap);
    };
    UniversalPkg.prototype.uninstall = function (pkg, version, isDep) {
        var e_5, _a, e_6, _b;
        var depended = this.getDepended(pkg, version);
        if (depended && depended.size > 0) {
            if (isDep) {
                return;
            }
            try {
                for (var depended_2 = __values(depended), depended_2_1 = depended_2.next(); !depended_2_1.done; depended_2_1 = depended_2.next()) {
                    var _c = __read(depended_2_1.value, 2), dependedPkg = _c[0], dependedVersion = _c[1];
                    throw "refusing to uninstall " + pkg + "@" + version + " because it is required by " + dependedPkg + "@" + dependedVersion + " ...";
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (depended_2_1 && !depended_2_1.done && (_a = depended_2["return"])) _a.call(depended_2);
                }
                finally { if (e_5) throw e_5.error; }
            }
        }
        var dependencies = this.getDependencies(pkg, version);
        if (dependencies) {
            try {
                for (var dependencies_1 = __values(dependencies), dependencies_1_1 = dependencies_1.next(); !dependencies_1_1.done; dependencies_1_1 = dependencies_1.next()) {
                    var _d = __read(dependencies_1_1.value, 2), requiredPkg = _d[0], requiredVersion = _d[1];
                    this.removeDepended(requiredPkg, requiredVersion, pkg, version);
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (dependencies_1_1 && !dependencies_1_1.done && (_b = dependencies_1["return"])) _b.call(dependencies_1);
                }
                finally { if (e_6) throw e_6.error; }
            }
        }
        if (isDep && this.isInstalled(pkg, version)) {
            return;
        }
        this.installed["delete"](pkg);
        this.saveChange();
    };
    UniversalPkg.prototype.removeDepended = function (pkg, version, dependedPkg, dependedVersion) {
        var dependedOn = this.getDepended(pkg, version);
        if (!dependedOn) {
            return;
        }
        if (dependedOn.get(dependedPkg) === dependedVersion) {
            dependedOn["delete"](dependedPkg);
        }
    };
    UniversalPkg.prototype.getDepended = function (pkg, version) {
        var r = this.getPkgRelation(pkg, version);
        if (!r) {
            return;
        }
        return r.dependedOn;
    };
    UniversalPkg.prototype.getDependencies = function (pkg, version) {
        var r = this.getPkgRelation(pkg, version);
        if (!r) {
            return;
        }
        return r.dependencies;
    };
    UniversalPkg.prototype.getPkgRelation = function (pkg, version) {
        var versionRelation = this.dependencies.get(pkg);
        if (!versionRelation) {
            return;
        }
        return versionRelation.get(version);
    };
    UniversalPkg.prototype.getAllDependencies = function () {
        return this.dependencies;
    };
    UniversalPkg.prototype.saveChange = function () {
        if (!fs_1["default"].existsSync(this.pkgFile)) {
            var d = path_1["default"].resolve(this.pkgFile, '..');
            if (!fs_1["default"].existsSync(d)) {
                fs_1["default"].mkdirSync(d, {
                    recursive: true
                });
            }
        }
        fs_1["default"].writeFileSync(this.pkgFile, JSON.stringify({
            version: this.version,
            installed: this.toObject(this.installed),
            dependencies: this.toObject(this.dependencies)
        }, null, 4));
    };
    UniversalPkg.prototype.toObject = function (obj) {
        var e_7, _a;
        if (!obj || typeof obj !== 'object') {
            return obj;
        }
        var newObj = Object.create(null);
        if (obj instanceof Map) {
            try {
                for (var obj_1 = __values(obj), obj_1_1 = obj_1.next(); !obj_1_1.done; obj_1_1 = obj_1.next()) {
                    var _b = __read(obj_1_1.value, 2), k = _b[0], v = _b[1];
                    v = typeof v === 'object' ? this.toObject(v) : v;
                    newObj[k] = v;
                }
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (obj_1_1 && !obj_1_1.done && (_a = obj_1["return"])) _a.call(obj_1);
                }
                finally { if (e_7) throw e_7.error; }
            }
        }
        else {
            for (var k in obj) {
                var v = obj[k];
                v = typeof v === 'object' ? this.toObject(v) : v;
                newObj[k] = v;
            }
        }
        return newObj;
    };
    return UniversalPkg;
}());
exports.UniversalPkg = UniversalPkg;
//# sourceMappingURL=pkg.js.map