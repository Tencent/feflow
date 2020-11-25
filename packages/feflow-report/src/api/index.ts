import rp from 'request-promise';
import { REPORT_URL, REPORT_PROXY, TIMEOUT } from '../constants';

// sniff user network and save
let isNeedProxyLocal = true;

export default class ApiController {
  private retryCount: number;
  private isNeedProxy: boolean;
  private rpOption: any;
  public log: any;

  constructor(param, log) {
    this.retryCount = 0;
    this.log = log;
    this.isNeedProxy = isNeedProxyLocal;
    this.rpOption = {
      method: 'POST',
      uri: REPORT_URL,
      body: param,
      json: true,
      timeout: TIMEOUT,
    };

    this.loadProxy();
  }

  private loadProxy() {
    if (this.isNeedProxy) {
      this.log.debug('feflow report with proxy.');
      this.rpOption.proxy = REPORT_PROXY;
    } else {
      this.log.debug('feflow report without proxy.');
      delete this.rpOption.proxy;
    }
  }

  private retryReport(cb) {
    this.retryCount++;
    this.log.debug('feflow report timeout, and retry. ', this.retryCount);
    this.isNeedProxy = !this.isNeedProxy;
    this.loadProxy();
    this.doReport(cb);
  }

  public doReport(cb = res => {}) {
    this.log.debug('feflow report start.');
    rp(this.rpOption)
      .then(response => {
        isNeedProxyLocal = this.isNeedProxy;
        this.log.debug('feflow report success.');
        cb(response || {});
      })
      .catch(e => {
        this.log.debug('feflow report fail. ', e.message);
        // timeout retry
        if (/ETIMEDOUT|ECONNREFUSED|ESOCKETTIMEDOUT/.test(e.message || '')) {
          if (this.retryCount >= 3) return;
          this.retryReport(cb);
        }
      });
  }
}
