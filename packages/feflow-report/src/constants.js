"use strict";
exports.__esModule = true;
exports.REPORT_STATUS = exports.TIMEOUT = exports.REPORT_PROXY = exports.REPORT_URL = exports.HOOK_TYPE_AFTER = exports.HOOK_TYPE_BEFORE = void 0;
/**
 * Namespace for collection of "before" hooks
 */
exports.HOOK_TYPE_BEFORE = 'before';
/**
 * Namespace for collection of "after" hooks
 */
exports.HOOK_TYPE_AFTER = 'after';
var BASIC_URL = 'http://api.feflowjs.com';
exports.REPORT_URL = BASIC_URL + "/api/v1/report/command";
exports.REPORT_PROXY = 'http://127.0.0.1:12639';
exports.TIMEOUT = 1000;
exports.REPORT_STATUS = {
    START: 0,
    COMPLETED: 1
};
//# sourceMappingURL=constants.js.map