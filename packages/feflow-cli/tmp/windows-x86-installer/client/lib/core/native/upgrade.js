"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var checkCliUpdate_1 = __importDefault(require("../../shared/checkCliUpdate"));
module.exports = function (ctx) {
    ctx.commander.register('upgrade', 'upgrade fef cli', function () {
        checkCliUpdate_1.default(ctx);
    });
};
//# sourceMappingURL=upgrade.js.map