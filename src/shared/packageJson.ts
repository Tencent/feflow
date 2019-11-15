const rp = require('request-promise');
import Bunyan from 'bunyan';

export default function getPackageVersion(name: string, version: string, registry: string, logger: Bunyan): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const options = {
      url: `${registry}${name}/${version}`,
      method: 'GET'
    };

    rp(options)
      .then((res: string) => {
        const response: any = JSON.parse(res);
        resolve(response.version);
      })
      .catch(() => {
        resolve("");
        logger.error(`get package ${name} version fail, check registry: ${registry}`)
      });
  });
}