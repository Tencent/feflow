"use strict";
exports.__esModule = true;
var chai_1 = require("chai");
var commander_1 = require("../../../src/core/commander");
var expect = chai_1["default"].expect;
describe('@feflow/core - Commander Unit Test', function () {
    it('register(name, desc, fn) - Register a command', function () {
        var command = new commander_1["default"]();
        command.register('test', 'test description', function () { });
        expect(command.get('test')).to.not.an('undefined');
    });
    it('get(name) - Get a command', function () {
        var command = new commander_1["default"]();
        command.register('test', 'test description', function () { });
        expect(command.get('test')).to.not.an('undefined');
    });
    it('get(name) - Get a command not a string', function () {
        var command = new commander_1["default"]();
        command.register('test', 'test description', function () { });
        expect(command.get(1)).to.be.an('undefined');
    });
    it('list() - List all command', function () {
        var command = new commander_1["default"]();
        command.register('test', 'test description', function () { });
        expect(command.list()).to.haveOwnProperty('test');
    });
});
//# sourceMappingURL=index.test.js.map