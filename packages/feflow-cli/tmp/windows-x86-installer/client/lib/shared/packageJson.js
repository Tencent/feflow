"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var request_promise_1 = __importDefault(require("request-promise"));
function packageJson(name, registry) {
    return new Promise(function (resolve, reject) {
        var options = {
            url: registry + "/" + name,
            method: 'GET',
        };
        request_promise_1.default(options)
            .then(function (response) {
            var data = JSON.parse(response);
            var version = data['dist-tags'].latest;
            resolve(version);
        })
            .catch(function (err) {
            reject(err);
        });
    });
}
exports.default = packageJson;
//# sourceMappingURL=packageJson.js.map