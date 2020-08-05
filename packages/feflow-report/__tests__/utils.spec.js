"use strict";
exports.__esModule = true;
var chai_1 = require("chai");
var _a = require('../src/common/utils'), httpRegex = _a.httpRegex, sshRegex = _a.sshRegex, getProjectByGit = _a.getProjectByGit, getGitStatus = _a.getGitStatus, getSystemInfo = _a.getSystemInfo;
var expect = chai_1["default"].expect;
var remoteUrlMap = {
    http: { valid: 'https://github.com/Tencent/feflow.git', invalid: 'https:github.com/Tencent/feflow.git' },
    ssh: { valid: 'git@github.com:Tencent/feflow.git', invalid: 'github.com:Tencent/feflow.git' }
};
describe('@feflow/report - utils', function () {
    it('httpRegex valid', function () {
        expect(httpRegex.test(remoteUrlMap.http.valid)).to.be["true"];
    });
    it('getSystemInfo() - get system info, and is not empty', function () {
        var systemInfoStr = getSystemInfo();
        var info = JSON.parse(systemInfoStr);
        expect(systemInfoStr).to.not.empty;
        expect(info).to.not.empty;
        expect(info.hostname).to.not.empty;
        expect(info.type).to.not.empty;
        expect(info.platform).to.not.empty;
        expect(info.arch).to.not.empty;
        expect(info.release).to.not.empty;
    });
    it('httpRegex invalid', function () {
        expect(httpRegex.test(remoteUrlMap.http.invalid)).to.be["false"];
        expect(httpRegex.test(remoteUrlMap.ssh.invalid)).to.be["false"];
    });
    it('sshRegex valid', function () {
        expect(sshRegex.test(remoteUrlMap.ssh.valid)).to.be["true"];
    });
    it('sshRegex invalid', function () {
        expect(sshRegex.test(remoteUrlMap.ssh.invalid)).to.be["false"];
        expect(sshRegex.test(remoteUrlMap.http.invalid)).to.be["false"];
    });
    it('getGitStatus work', function () {
        expect(getGitStatus()).to.be["false"];
    });
    it('getProjectByGit http valid', function () {
        expect(getProjectByGit(remoteUrlMap.http.valid)).to.be.equal('Tencent/feflow');
    });
    it('getProjectByGit ssh valid', function () {
        expect(getProjectByGit(remoteUrlMap.ssh.valid)).to.be.equal('Tencent/feflow');
    });
    it('when given invalid http url, then getProjectByGit should be ""', function () {
        expect(getProjectByGit(remoteUrlMap.http.invalid)).to.be.equal('');
    });
    it('when given invalid ssh url, then getProjectByGit should be ""', function () {
        expect(getProjectByGit(remoteUrlMap.ssh.invalid)).to.be.equal('');
    });
});
//# sourceMappingURL=utils.spec.js.map