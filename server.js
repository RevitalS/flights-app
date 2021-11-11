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
      readFileByType(res, parseUrl.pathname, parseUrl.query);
    }
  })
  .listen(8080, function () {
    console.log('Client is available at http://localhost:8080');
  });

function getUrlSuffix(url) {
  const suffix = url.split('.').pop();
  return suffix;
}

function readFileByType(res, url, query) {
  const suffix = getUrlSuffix(url);
  if (!(suffix in types)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.write('File not found');
    return;
  }
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
      if (suffix === 'json') {
        hendleJsonFile(res, data, query);
      } else {
        res.writeHead(200, { 'Content-Type': types[suffix] });
        res.write(data);
        res.end();
      }
    }
  });
}

function filteredFlights(flights, filterType, filterValue) {
  console.log(flights[0][filterType]);
  console.log(filterValue);
  const result = flights.filter(
    (flight) =>
      getCheckingFormat(flight[filterType]) == getCheckingFormat(filterValue)
  );
  return result;
}

function getCheckingFormat(str) {
  str = str.toLowerCase();
  return str.replace(/[^a-zA-Z ]+/g, '_');
}

function hendleJsonFile(res, data, query) {
  console.log('im here');
  const queryObject = parseQuery(query);

  const jData = JSON.parse(data);
  let filghts = [];
  console.log(queryObject , 'object');
  queryObject.forEach((value, type) => {
    filghts = [...filghts, ...filteredFlights(jData, type, value)];
    console.log(filghts);
  });
  //const flight = filteredFlights(jData, queryObject[0].key(), queryObject[0].value)
  res.write(JSON.stringify(filghts));
  res.end();
}

function parseQuery(querys) {
  if (querys.length === 0) {
    return false;
  }
  const map = new Map();
  const queryList = querys.split('&');
  queryList.map((query) => {
    if (query.length > 0){
    const taple = query.split('=');
    map.set(taple[0], getCheckingFormat(taple[1]));
    }
  });
  return map;
}
