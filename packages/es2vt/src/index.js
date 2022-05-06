const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const config = require('./config');
const eventSource = require('./resources/event');
const _ = require('lodash');
// custom middelware that allows querying by a registered hash
const { hashMiddleware } = require('./hashMiddleware');

const { asyncMiddleware, ResponseError, errorHandler, unknownRouteHandler } = require('./resources/errorHandler');

const app = express();
app.use(compression());
app.use(express.static('public'));
app.use(bodyParser.json());

let setCache = function (req, res, next) {
  const period = 600; // unit seconds
  // if GET request, then add caching
  if (req.method == 'GET') {
    res.set('Cache-control', `public, max-age=${period}`)
  }
  // call next() to pass on the request
  next()
}
// use middleware
app.use(setCache)

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  // Pass to next layer of middleware
  next();
});

// extract query and variables from store if a hash is provided instead of a query or variable
app.use(hashMiddleware);

// register an ES filter and get a token back for subsequent querying
app.post('/register', function (req, res, next) {
  // first check that the user is allowed to register a filter
  const apiKey = _.get(req, 'query.apiKey') || _.get(req, 'body.apiKey') || _.get(req, 'headers.Authorization', '').substr(10) || _.get(req, 'headers.authorization', '').substr(10);
  if (!apiKey) {
    next(new ResponseError(401, 'temporaryAuthentication', 'You need to provide an apiKey in the url'));
  } else if (apiKey !== config.apiKey || !config.apiKey) {
    next(new ResponseError(403, 'temporaryAuthentication', `Invalid apiKey: ${apiKey}`));
  }
  delete req.query.apiKey;

  //now save the filter and return a token
  res.json({queryId: res.get('X-query-ID')})
});

// get a vactor tile passing a token as a query parameter to filter
app.get('/event/mvt/:z/:x/:y', asyncMiddleware(searchMvt({ dataSource: eventSource })));

function searchMvt(dataSource) {
  return async (req, res, next) => {
    if (!req.query.queryId) {
      return next(new ResponseError(403, 'temporaryAuthentication', `Missing queryId`));
    }
    try {
      const query = req?.query?.query;
      const tile = await eventSource.queryMvt({ query, tileParams: {...req.params} });
      res.writeHead(200, {
        'content-disposition': 'inline',
        'content-length': tile ? `${tile.body.length}` : `0`,
        'Content-Type': 'application/x-protobuf',
        'Cache-Control': `public, max-age=0`,
        'Last-Modified': `${new Date().toUTCString()}`
      });

      res.end(Buffer.from(tile.body, 'binary'));

    } catch (err) {
      next(err);
    }
  }
}


app.get('*', unknownRouteHandler);
app.use(errorHandler);

app.listen({ port: config.port }, () =>
  console.log(`🚀 Server ready at http://localhost:${config.port}`)
);
