const http = require('http');
const fs = require('fs');
const url = require('url');

//const filghts = require('public/filghts.json');

//console.log(filghts);
const types = {
  js: 'text/javascript',
  html: 'text/html',
  json: 'application/json,',
  css: 'text/css',
};

http
  .createServer(function (req, res) {
    const parseUrl = url.parse(req.url);
    if (req.url === '/') {
      fs.readFile('public/index.html', function (err, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        res.end();
      });
    } else {
      const suffix = getUrlSuffix(parseUrl.pathname);
      if (suffix in types) {
        if (suffix === 'json') {
          getJsonFile(parseUrl.pathname, parseUrl.query);
        }
        readFileByType(res, parseUrl.pathname, suffix);
      }
    }
  })
  .listen(8080, function () {
    console.log('Client is available at http://localhost:8080');
  });

function getUrlSuffix(url) {
  const suffix = url.split('.').pop();
  return suffix;
}

function readFileByType(res, url, prefix) {
  fs.readFile(`public${url}`, function (err, data) {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('File not found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.write('Server Have problem');
      }
    } else {
      res.writeHead(200, { 'Content-Type': types[prefix] });
      res.write(data);
      res.end();
    }
  });
}

function filteredFlightsJson() {

}

function getJsonFile(url, query) {

  const jsonData = fs.readFile(`public${url}`, function (err, data) {
    const jData = JSON.parse(data);
    res.write(jData);
    res.end();
  })
}

function parseQuery(querys) {
  if (querys.length === 0) {
    return false;
  }
  const q = {}
  const queryList = querys.split('&');
  queryList.map((query) => {
    const taple = query.split('=');
    q[taple[0]] = taple[1];
  })
  return q;
}