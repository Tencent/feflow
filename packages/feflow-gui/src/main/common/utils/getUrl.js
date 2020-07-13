import { app } from 'electron';

export default function (routeName = '') {
  const isDev = process.env.NODE_ENV === 'development';

  let localUrl = 'http://localhost:9080/';
  let serveUrl = `http://localhost:${app.guiPort}/`;
  if (routeName) {
    localUrl += `#/${routeName}`;
    serveUrl += `#/${routeName}`;
  }

  return isDev ? localUrl : serveUrl;
}
