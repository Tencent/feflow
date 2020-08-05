"use strict";
exports.__esModule = true;
var compose_1 = require("../../../src/core/plugin/compose");
var chai_1 = require("chai");
var expect = chai_1["default"].expect;
describe('@feflow/core - Plugin compose', function () {
    it('Composes from right to left', function () {
        var double = function (x) { return x * 2; };
        var square = function (x) { return x * x; };
        expect(compose_1["default"](square)(5)).to.be.eql(25);
        expect(compose_1["default"](square, double)(5)).to.eql(100);
        expect(compose_1["default"](double, square, double)(5)).to.be.eql(200);
    });
    it('Composes functions from right to left', function () {
        var a = function (next) { return function (x) { return next(x + 'a'); }; };
        var b = function (next) { return function (x) { return next(x + 'b'); }; };
        var c = function (next) { return function (x) { return next(x + 'c'); }; };
        var final = function (x) { return x; };
        expect(compose_1["default"](a, b, c)(final)('')).to.be.eql('abc');
        expect(compose_1["default"](b, c, a)(final)('')).to.be.eql('bca');
        expect(compose_1["default"](c, a, b)(final)('')).to.be.eql('cab');
    });
    it('Can be seeded with multiple arguments', function () {
        var square = function (x) { return x * x; };
        var add = function (x, y) { return x + y; };
        expect(compose_1["default"](square, add)(1, 2)).to.be.eql(9);
    });
    it('Returns the first function if given only one', function () {
        var fn = function () { };
        expect(compose_1["default"](fn)).to.be.eql(fn);
    });
});
//# sourceMappingURL=compose.test.js.map