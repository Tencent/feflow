import rp from 'request-promise';
import { REPORT_URL, REPORT_PROXY } from '../constants';

export default class ApiController {
  private retryCount: number;
  private needProxy: boolean;
  private rpOption: any;
  public log: any;

  constructor(param, log, needProxy = true) {
    this.retryCount = 0;
    this.log = log;
    this.needProxy = needProxy;
    this.rpOption = {
      method: 'POST',
      uri: REPORT_URL,
      body: param,
      json: true,
      timeout: 600,
    };

    this.loadProxy();
  }

  private loadProxy() {
    if (this.needProxy) {
      this.log.debug('report with proxy');
      this.rpOption.proxy = REPORT_PROXY;
    } else {
      delete this.rpOption.proxy;
    }
  }

  private retryReport(cb) {
    this.retryCount++;
    this.log.debug('feflow report 超时重试', this.retryCount);
    this.needProxy = !this.needProxy;
    this.loadProxy();
    this.doReport(cb);
  }

  public doReport(cb = res => {}) {
    rp(this.rpOption)
      .then(response => {
        cb(response || {});
      })
      .catch(e => {
        this.log.debug('feflow report fail', e.message);
        // timeout retry
        if (/ETIMEDOUT|ECONNREFUSED|ESOCKETTIMEDOUT/.test(e.message || '')) {
          if (this.retryCount >= 3) return;
          this.retryReport(cb);
        }
      });
  }
}
