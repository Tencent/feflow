"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = __importDefault(require("./logger"));
var Feflow = /** @class */ (function () {
    function Feflow(args) {
        args = args || {};
        this.logger = logger_1.default({
            debug: Boolean(args.debug),
            silent: Boolean(args.silent)
        });
    }
    return Feflow;
}());
exports.default = Feflow;
