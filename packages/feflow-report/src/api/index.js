"use strict";
exports.__esModule = true;
var request_promise_1 = require("request-promise");
var constants_1 = require("../constants");
// sniff user network and save
var isNeedProxyLocal = true;
var ApiController = /** @class */ (function () {
    function ApiController(param, log) {
        this.retryCount = 0;
        this.log = log;
        this.isNeedProxy = isNeedProxyLocal;
        this.rpOption = {
            method: 'POST',
            uri: constants_1.REPORT_URL,
            body: param,
            json: true,
            timeout: constants_1.TIMEOUT
        };
        this.loadProxy();
    }
    ApiController.prototype.loadProxy = function () {
        if (this.isNeedProxy) {
            this.log.debug('feflow report with proxy.');
            this.rpOption.proxy = constants_1.REPORT_PROXY;
        }
        else {
            this.log.debug('feflow report without proxy.');
            delete this.rpOption.proxy;
        }
    };
    ApiController.prototype.retryReport = function (cb) {
        this.retryCount++;
        this.log.debug('feflow report timeout, and retry. ', this.retryCount);
        this.isNeedProxy = !this.isNeedProxy;
        this.loadProxy();
        this.doReport(cb);
    };
    ApiController.prototype.doReport = function (cb) {
        var _this = this;
        if (cb === void 0) { cb = function (res) { }; }
        this.log.debug('feflow report start.');
        request_promise_1["default"](this.rpOption)
            .then(function (response) {
            isNeedProxyLocal = _this.isNeedProxy;
            _this.log.debug('feflow report success.');
            cb(response || {});
        })["catch"](function (e) {
            _this.log.debug('feflow report fail. ', e.message);
            // timeout retry
            if (/ETIMEDOUT|ECONNREFUSED|ESOCKETTIMEDOUT/.test(e.message || '')) {
                if (_this.retryCount >= 3)
                    return;
                _this.retryReport(cb);
            }
        });
    };
    return ApiController;
}());
exports["default"] = ApiController;
//# sourceMappingURL=index.js.map