import rp from 'request-promise';
import URI from './config';
import shell from 'shelljs';

export default {
  log: {},
  report(param, log) {
    this.log = log || {};
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
        this.log.debug('got report response', res);
      })
      .catch(e => {
        this.log.debug('feflow report fail', e);
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

    this.log.debug("cmdWithProxy.join(' ')", cmdWithProxy.join(' '));

    const res = shell
      .exec(cmdWithProxy.join(' '), { silent: true })
      .stdout.trim();

    this.log.debug('res', res);
  }
};
