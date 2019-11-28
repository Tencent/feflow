const rp = require('request-promise');

export default function packageJson(name: string, version: string, registry: string) {
  return new Promise((resolve, reject) => {
    const options = {
      url: `${registry}${name}/${version}`,
      method: 'GET'
    };

    rp(options)
      .then((response: any) => {
        response = JSON.parse(response);
        resolve(response.version);
      })
      .catch((err: object) => {
        reject(err);
      });
  });
}