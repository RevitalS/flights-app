const http = require('http');
const fs = require('fs');

const types = {
  js: 'text/javascript',
  html: 'text/html',
  json: 'application/json,',
  css: 'text/css',
};

http
  .createServer(function (req, res) {
    if (req.url === '/') {
      fs.readFile('public/index.html', function (err, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        res.end();
      });
    } else {
      const suffix = parseUrl(req.url);
      if (suffix in types) {
        readFileByType(res, req.url, suffix);
      }
    }
  })
  .listen(8080, function () {
    console.log('Client is available at http://localhost:8080');
  });

function parseUrl(url) {
  const suffix = url.split('.').pop();
  console.log(suffix);
  return suffix;
}

function readFileByType(res, url, prefix) {
  fs.readFile(`public${url}`, function (err, data) {
    res.writeHead(200, { 'Content-Type': types[prefix] });
    res.write(data);
    res.end();
  });
}
