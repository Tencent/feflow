import rp from 'request-promise';

export default function packageJson(
  name: string,
  registry: string
): Promise<string> {
  const names = (name || '').split('@');
  return new Promise((resolve, reject) => {
    const options = {
      url: `${registry}/${names[1] ? names.join('/') : names[0]}`,
      method: 'GET'
    };

    rp(options)
      .then((response: any) => {
        const data = JSON.parse(response);
        if (names.length === 1) {
          const version = data['dist-tags'].latest;
          resolve(version);
        } else {
          // 指定包的版本情况
          resolve(data['version']);
        }
      })
      .catch((err: object) => {
        reject(err);
      });
  });
}
