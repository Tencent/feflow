import rp from 'request-promise';
import URI from './config';
import shell from 'shelljs';

export default {
  logger: {},
  report(param, log) {
    this.logger = log || {};
    const proxyIsOn = shell
      .exec(`curl ${URI.REPORT_PROXY}`, { silent: true })
      .stdout.trim();

    if (proxyIsOn) {
      log.debug('Report, chose proxy curl');
      this.reportWithProxy(param);
    } else {
      log.debug('Report, chose normal http');
      this.reportWithoutProxy(param);
    }
  },
  reportWithoutProxy(param) {
    rp({
      method: 'POST',
      uri: URI.REPORT_URL,
      body: param,
      json: true
    })
      .then(res => {
        this.logger.debug('got report response', res);
      })
      .catch(e => {
        console.log('feflow report fail', e);
      });
  },
  reportWithProxy(param) {
    let dataString = '';
    // get formated report params
    Object.keys(param).forEach(key => {
      let value = param[key];
      value = typeof value == 'object' ? JSON.stringify(value) : value;
      if (value != undefined) {
        dataString += `&${key}=${value}`;
      }
    });

    const cmdWithProxy = [];

    // curl
    cmdWithProxy.push('curl');

    // proxy
    cmdWithProxy.push('-x');
    cmdWithProxy.push(URI.REPORT_PROXY);

    // url
    cmdWithProxy.push(URI.REPORT_URL);

    // params
    cmdWithProxy.push('-d');
    cmdWithProxy.push("'" + dataString.slice(1) + "'");

    this.logger.debug("cmdWithProxy.join(' ')", cmdWithProxy.join(' '));

    const res = shell
      .exec(cmdWithProxy.join(' '), { silent: true })
      .stdout.trim();

    this.logger.debug('res', res);
  }
};
