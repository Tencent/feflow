import URI from './api/config';

import rp from 'request-promise';

rp({
  method: 'POST',
  uri: URI.REPORT_URL,
  body: { command: 'dev' },
  json: true,
  proxy: URI.REPORT_PROXY
})
  .then(res => {
    console.log('got report response', res);
  })
  .catch(e => {
    console.log('feflow report fail', e);
  });
