"use strict";
exports.__esModule = true;
exports.InstallAttribute = exports.Install = void 0;
var nedb_1 = require("nedb");
var InstallPersistence = /** @class */ (function () {
    function InstallPersistence(dbFile) {
        this.db = new nedb_1["default"]({ filename: dbFile, autoload: true });
        this.db.loadDatabase();
    }
    InstallPersistence.prototype.save = function (pkg, iversion, cversion, attributes) {
        var _this = this;
        var install = new Install(pkg, iversion, cversion, attributes);
        return new Promise(function (resolve, reject) {
            _this.db.update(Install.query(pkg, iversion), install, { upsert: true }, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    };
    InstallPersistence.prototype.find = function (pkg, iversion) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.findOne(Install.query(pkg, iversion), undefined, function (err, doc) {
                if (err) {
                    return reject(err);
                }
                else {
                    if (!doc) {
                        resolve();
                    }
                    else {
                        resolve(Install.from(doc));
                    }
                }
            });
        });
    };
    return InstallPersistence;
}());
exports["default"] = InstallPersistence;
var Install = /** @class */ (function () {
    function Install(pkg, iversion, cversion, attributes) {
        this.pkg = pkg;
        this.installVersion = iversion;
        this.checkoutVersion = cversion;
        this.attributes = attributes;
    }
    Install.from = function (obj) {
        var pkg = obj === null || obj === void 0 ? void 0 : obj.pkg;
        var installVersion = obj === null || obj === void 0 ? void 0 : obj.installVersion;
        var checkoutVersion = obj === null || obj === void 0 ? void 0 : obj.checkoutVersion;
        var attributes = InstallAttribute.from(obj === null || obj === void 0 ? void 0 : obj.attributes);
        return new Install(pkg, installVersion, checkoutVersion, attributes);
    };
    Install.query = function (pkg, iversion) {
        return { pkg: pkg, installVersion: iversion };
    };
    return Install;
}());
exports.Install = Install;
var InstallAttribute = /** @class */ (function () {
    function InstallAttribute(obj) {
        if (obj === null || obj === void 0 ? void 0 : obj.createTime) {
            this.createTime = obj === null || obj === void 0 ? void 0 : obj.createTime;
        }
        else {
            this.createTime = Date.now();
        }
        if (obj === null || obj === void 0 ? void 0 : obj.upgradeTime) {
            this.upgradeTime = obj === null || obj === void 0 ? void 0 : obj.upgradeTime;
        }
    }
    InstallAttribute.from = function (obj) {
        var attribute = new InstallAttribute();
        attribute.upgradeTime = obj === null || obj === void 0 ? void 0 : obj.upgradeTime;
        attribute.createTime = obj === null || obj === void 0 ? void 0 : obj.createTime;
        return attribute;
    };
    return InstallAttribute;
}());
exports.InstallAttribute = InstallAttribute;
//# sourceMappingURL=install.js.map