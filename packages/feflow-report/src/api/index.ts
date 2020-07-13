import rp from 'request-promise';
import URI from './config';

export default {
  retryCount: 0,
  log: {},
  report(param, log, needProxy = true) {
    this.log = log || {};

    const rpOption: any = {
      method: 'POST',
      uri: URI.REPORT_URL,
      body: param,
      json: true,
      timeout: 600,
    };

    if (needProxy) {
      this.log.debug('report with proxy');
      rpOption.proxy = URI.REPORT_PROXY;
    }

    rp(rpOption)
      .then((res) => {
        this.log.debug('got report response', res);
      })
      .catch((e) => {
        this.log.debug('feflow report fail', e.message);
        if (/ETIMEDOUT/.test(e.message || '')) {
          if (this.retryCount > 2) return;
          // timeout retry
          this.log.debug('feflow report 超时重试', this.retryCount);
          // 3nd rp request, remove rp proxy
          // eslint-disable-next-line eqeqeq
          const needProxy = this.retryCount != 2;
          this.retryCount = this.retryCount + 1;
          this.report(Object.assign({}, param), this.log, needProxy);
        }
      });
  },
};
