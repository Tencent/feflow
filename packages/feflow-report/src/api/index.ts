import rp from 'request-promise';
import URI from './config';

export default {
  report(param) {
    console.log('param', param);
    rp({
      method: 'POST',
      uri: URI.REPORT_URL,
      body: param,
      json: true
    })
      .then(res => {
        console.log('got report response', res);
      })
      .catch(e => {
        console.log('rp report fail', e);
      });
  }
};
