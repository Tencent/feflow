import rp from 'request-promise';

export default function packageJson(name: string, registry: string) {
  return new Promise((resolve, reject) => {
    const options = {
      url: `${registry}/${name}`,
      method: 'GET'
    };

    rp(options)
      .then((response: any) => {
        const data = JSON.parse(response);
        const version = data['dist-tags'].latest;
        resolve(version);
      })
      .catch((err: object) => {
        reject(err);
      });
  });
}