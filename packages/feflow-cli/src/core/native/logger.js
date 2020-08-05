"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
module.exports = function (ctx) {
    ctx.commander.register('logger', 'logger Message', function () {
        var args = ctx.args._ || [];
        var _a = __read(args, 2), types = _a[0], msg = _a[1];
        switch (types) {
            case 'info':
            case 'warn':
            case 'error':
                ctx.logger[types](msg);
                break;
            default:
                console.log('nothing types');
                break;
        }
    });
};
//# sourceMappingURL=logger.js.map