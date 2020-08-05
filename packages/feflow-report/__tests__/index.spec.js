"use strict";
exports.__esModule = true;
var chai_1 = require("chai");
var Report = require('../src/index');
var _a = require('../src/common/utils'), getUserName = _a.getUserName, httpRegex = _a.httpRegex, sshRegex = _a.sshRegex;
var expect = chai_1["default"].expect;
describe('@feflow/report - report', function () {
    var report;
    before(function () {
        report = new Report({});
    });
    it('getUserName() - username is not empty', function () {
        var username = getUserName();
        expect(username).to.not.empty;
    });
    it('getReportBody() ', function () {
        var body = report.getReportBody('install', 'time/builder');
        expect(body).to.not.empty;
        expect(body.command).to.eq('install');
        expect(body.user_name).to.not.empty;
        expect(body.params).to.eq('time/builder');
        expect(body.system_info).to.not.empty;
        expect(body.project).to.eq('@feflow/report');
    });
    after(function () {
        report = null;
    });
});
//# sourceMappingURL=index.spec.js.map