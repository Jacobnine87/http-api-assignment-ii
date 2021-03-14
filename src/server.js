const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const handlePost = (req, res, parsedUrl) => {
  if (parsedUrl.pathname === '/addUser') {
    const body = [];

    req.on('error', () => {
      // Eslint doesn't like console.dir(err)
      res.statusCode = 400;
      res.end();
    });

    req.on('data', (chunk) => {
      body.push(chunk);
    });

    req.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      jsonHandler.addUser(req, res, bodyParams);
    });
  }
};

const handleHead = (req, res, parsedUrl) => {
  switch (parsedUrl.pathname) {
    case '/getUsers':
      jsonHandler.getUsersMeta(req, res);
      break;
    case '/notReal':
    default:
      jsonHandler.notFoundMeta(req, res);
      break;
  }
};

const handleGet = (req, res, parsedUrl) => {
  if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(req, res);
  } else if (parsedUrl.pathname === '/getUsers') {
    jsonHandler.getUsers(req, res);
  } else if (parsedUrl.pathname === '/notReal') {
    jsonHandler.notFound(req, res);
  } else if (parsedUrl.pathname === '/') {
    htmlHandler.getIndex(req, res);
  } else {
    jsonHandler.notFound(req, res);
  }
};

const onRequest = (req, res) => {
  const parsedUrl = url.parse(req.url);

  if (req.method === 'POST') {
    handlePost(req, res, parsedUrl);
  } else if (req.method === 'HEAD') {
    handleHead(req, res, parsedUrl);
  } else {
    handleGet(req, res, parsedUrl);
  }
};

http.createServer(onRequest).listen(port);
