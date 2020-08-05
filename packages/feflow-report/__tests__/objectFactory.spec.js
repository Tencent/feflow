"use strict";
exports.__esModule = true;
var chai_1 = require("chai");
var objectFactory_1 = require("../src/common/objectFactory");
var expect = chai_1["default"].expect;
describe('@feflow/report - objectFactory', function () {
    beforeEach(function () {
        objectFactory_1["default"].done();
    });
    it('objectFactory - create', function () {
        var obj = objectFactory_1["default"].create().done();
        expect(obj).to.empty;
        expect(obj).to.deep.eq({});
    });
    it('objectFactory - load', function () {
        var obj = objectFactory_1["default"].create()
            .load('a', 123)
            .load('b', 321)
            .load('c', function () { return 'awosome objectFactory'; })
            .done();
        expect(obj).to.not.empty;
        expect(obj).to.deep.eq({ a: 123, b: 321, c: 'awosome objectFactory' });
    });
    it('objectFactory - done', function () {
        var obj = objectFactory_1["default"].create()
            .load('a', 123)
            .load('b', 321)
            .load('c', function () { return 'awosome objectFactory'; })
            .done();
        expect(obj).to.not.empty;
        expect(obj).to.deep.eq({ a: 123, b: 321, c: 'awosome objectFactory' });
        var _obj = objectFactory_1["default"].create().done();
        expect(_obj).to.empty;
    });
});
//# sourceMappingURL=objectFactory.spec.js.map