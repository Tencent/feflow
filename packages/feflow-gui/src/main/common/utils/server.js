const http = require('http');
const fs = require('fs');
const { app } = require('electron');

function createServer(callback) {
  http.createServer((req, res) => {
    let url = req.url === '/' ? '/index.html' : req.url;

    url = `${__dirname}${url}`;

    const data = fs.readFileSync(url);

    res.write(data);
    res.end();

    callback && callback();
  }).listen(app.guiPort);
}

export default createServer;
