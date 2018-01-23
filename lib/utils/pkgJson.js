'use strict';

const rp = require('request-promise');

function pkgJson(name, version, registry) {
  return new Promise(function (resolve, reject) {
    const options = {
      url: `${registry}/${name}/${version}`,
      method: 'GET'
    };

    rp(options)
      .then(function (response) {
        response = JSON.parse(response);
        resolve(response);
      })
      .catch((err) => {
        resolve({err: err && err.message});
      });
  });
}

module.exports = pkgJson;