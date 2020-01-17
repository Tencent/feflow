"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rp = require('request-promise');
function packageJson(name, version, registry) {
    return new Promise(function (resolve, reject) {
        var options = {
            url: "" + registry + name + "/" + version,
            method: 'GET'
        };
        rp(options)
            .then(function (response) {
            response = JSON.parse(response);
            resolve(response.version);
        })
            .catch(function (err) {
            reject(err);
        });
    });
}
exports.default = packageJson;
//# sourceMappingURL=packageJson.js.map