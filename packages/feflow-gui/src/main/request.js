/* eslint-disable */

import { app, session } from 'electron';

app.on('ready', () => {
  // Modify the user agent for all requests to the following urls.
  const filter = {
    urls: ['http://gui.oa.com/*']
  }

  session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    details.requestHeaders['Access-Control-Allow-Origin'] = '*';
    callback({ requestHeaders: details.requestHeaders })
  })
});