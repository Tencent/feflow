"use strict";
exports.__esModule = true;
var cache = {};
var objectFactory = {
    obj: null,
    create: function () {
        this.obj = Object.create(null);
        return this;
    },
    load: function (key, value) {
        var objValue = '';
        if (typeof value == 'function') {
            objValue = value();
        }
        else {
            objValue = value === undefined ? cache[key] : value;
        }
        if (!objValue) {
            return this;
        }
        this.obj[key] = objValue;
        if (cache[key] === undefined) {
            cache[key] = this.obj[key];
        }
        return this;
    },
    done: function () {
        var target = Object.assign({}, this.obj);
        this.obj = null;
        return target;
    }
};
exports["default"] = objectFactory;
//# sourceMappingURL=objectFactory.js.map