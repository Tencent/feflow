const http = require('http');
const fs = require('fs');

function createServer(callback) {
  http.createServer((req, res) => {
    let url = req.url === '/' ? '/index.html' : req.url;

    url = `${__dirname}${url}`;

    let data = fs.readFileSync(url);

    res.write(data);
    res.end();

    callback && callback();
  }).listen(9081);
}

export default createServer;
