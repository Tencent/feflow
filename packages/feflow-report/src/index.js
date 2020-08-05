"use strict";
exports.__esModule = true;
var api_1 = require("./api");
var utils_1 = require("./common/utils");
var objectFactory_1 = require("./common/objectFactory");
var constants_1 = require("./constants");
var Report = /** @class */ (function () {
    function Report(feflowContext, cmd, args) {
        var _this = this;
        this.reportOnHookBefore = function () {
            var _a;
            var _b = _this, cmd = _b.cmd, args = _b.args;
            var store = ((_a = _this.ctx.commander) === null || _a === void 0 ? void 0 : _a.store[cmd]) || {};
            _this.commandSource = (store === null || store === void 0 ? void 0 : store.pluginName) || '';
            if (!_this.commandSource && typeof store.options === 'string') {
                _this.commandSource = store.options;
            }
            _this.ctx.log.debug('HOOK_TYPE_BEFORE');
            _this.startTime = Date.now();
            _this.report(cmd, args);
        };
        this.reportOnHookAfter = function () {
            _this.ctx.log.debug('HOOK_TYPE_AFTER');
            _this.costTime = Date.now() - _this.startTime;
            _this.recallReport();
        };
        this.ctx = feflowContext;
        this.cmd = cmd;
        this.args = args;
        this.userName = utils_1.getUserName();
        this.systemInfo = utils_1.getSystemInfo();
        this.project = utils_1.getProject(this.ctx);
        this.loadContextLogger();
    }
    // register before/after hook event
    Report.prototype.registerHook = function () {
        this.ctx.hook.on(constants_1.HOOK_TYPE_BEFORE, this.reportOnHookBefore);
        // report some performance data after command executed
        this.ctx.hook.on(constants_1.HOOK_TYPE_AFTER, this.reportOnHookAfter);
    };
    Report.prototype.loadContextLogger = function () {
        this.ctx.log = this.ctx.log || this.ctx.logger;
        this.ctx.log = this.ctx.log ? this.ctx.log : { info: console.log, debug: console.log };
    };
    Report.prototype.getReportBody = function (cmd, args) {
        return objectFactory_1["default"]
            .create()
            .load('command', cmd)
            .load('feflow_version', this.ctx.version)
            .load('command_source', this.commandSource)
            .load('user_name', this.userName)
            .load('params', args)
            .load('system_info', this.systemInfo)
            .load('project', this.project)
            .load('status', constants_1.REPORT_STATUS.START)
            .done();
    };
    Report.prototype.getRecallBody = function () {
        return objectFactory_1["default"]
            .create()
            .load('command')
            .load('generator_project', this.generatorProject)
            .load('recall_id', this.reCallId)
            .load('cost_time', this.costTime)
            .load('is_fail', false)
            .load('status', constants_1.REPORT_STATUS.COMPLETED)
            .done();
    };
    Report.prototype.checkBeforeReport = function (cmd) {
        return !!cmd;
    };
    Report.prototype.init = function (cmd) {
        this.cmd = cmd;
        this.args = this.ctx.args;
        // hook is not supported in feflow 0.16.x
        if (this.ctx.hook) {
            this.registerHook();
        }
    };
    Report.prototype.report = function (cmd, args) {
        var _this = this;
        // args check
        if (!this.checkBeforeReport(cmd))
            return;
        try {
            var reportBody = this.getReportBody(cmd, args);
            this.ctx.log.debug('reportBody', JSON.stringify(reportBody));
            var report = new api_1["default"](reportBody, this.ctx.log);
            report.doReport(function (_a) {
                var result = _a.result;
                var id = (result || {}).id;
                _this.reCallId = id;
                // hack async
                if (_this.isRecallActivating) {
                    _this.recallReport();
                }
            });
        }
        catch (error) {
            this.ctx.log.debug('feflow report got error，please contact administractor to resolve ', error);
        }
    };
    Report.prototype.recallReport = function () {
        this.isRecallActivating = true;
        if (!this.reCallId)
            return;
        try {
            var reCallBody = this.getRecallBody();
            this.ctx.log.debug('reCallBody', JSON.stringify(reCallBody));
            var report = new api_1["default"](reCallBody, this.ctx.log);
            report.doReport();
        }
        catch (error) {
            this.ctx.log.debug('feflow recallReport got error，please contact administractor to resolve ', error);
        }
    };
    Report.prototype.reportInitResult = function () {
        var cmd = this.cmd;
        if (cmd !== 'init') {
            return;
        }
        this.costTime = Date.now() - this.startTime;
        this.generatorProject = utils_1.getProject(this.ctx, true);
        this.recallReport();
    };
    return Report;
}());
module.exports = Report;
//# sourceMappingURL=index.js.map