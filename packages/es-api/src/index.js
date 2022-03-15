const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const _ = require('lodash');
const config = require('./config');
const literature = require('./resources/literature');
const occurrence = require('./resources/occurrence');
const dataset = require('./resources/dataset');
const event = require('./resources/event');
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

app.post('/occurrence/meta', asyncMiddleware(postMetaOnly(occurrence)));
app.get('/occurrence/meta', asyncMiddleware(getMetaOnly(occurrence)));

const temporaryAuthMiddleware = function (req, res, next) {
  const apiKey = _.get(req, 'query.apiKey') || _.get(req, 'body.apiKey') || _.get(req, 'headers.Authorization', '').substr(10) || _.get(req, 'headers.authorization', '').substr(10);
  if (!apiKey) {
    next(new ResponseError(401, 'temporaryAuthentication', 'You need to provide an apiKey in the url'));
  } else if (apiKey !== config.apiKey || !config.apiKey) {
    next(new ResponseError(403, 'temporaryAuthentication', `Invalid apiKey: ${apiKey}`));
  }
  // the apiKey shouldn't be used elsewhere and shouldn't be interpreted as a es query param
  delete req.query.apiKey;
  // Pass to next layer of middleware
  next()
}
app.use(temporaryAuthMiddleware)

app.post('/literature', asyncMiddleware(searchResource(literature)));
app.get('/literature', asyncMiddleware(searchResource(literature)));
app.get('/literature/key/:id', asyncMiddleware(keyResource(literature)));

app.post('/occurrence', asyncMiddleware(searchResource(occurrence)));
app.get('/occurrence', asyncMiddleware(searchResource(occurrence)));
app.get('/occurrence/key/:id', asyncMiddleware(keyResource(occurrence)));
app.get('/occurrence/suggest/:key', asyncMiddleware(suggestResource(occurrence)));

app.post('/dataset', asyncMiddleware(searchResource(dataset)));
app.get('/dataset', asyncMiddleware(searchResource(dataset)));
app.get('/dataset/key/:id', asyncMiddleware(keyResource(dataset)));

app.post('/event', asyncMiddleware(searchResource(event)));
app.get('/event', asyncMiddleware(searchResource(event)));
app.get('/event/key/:id', asyncMiddleware(keyResource(event)));

function searchResource(resource) {
  const { dataSource, get2predicate, predicate2query, get2metric, metric2aggs } = resource;
  return async (req, res, next) => {
    try {
      const { metrics, predicate, size, from, includeMeta } = parseQuery(req, res, next, { get2predicate, get2metric });
      const aggs = metric2aggs(metrics);
      const query = predicate2query(predicate);
      const { result, esBody } = await dataSource.query({ query, aggs, size, from, req });
      const meta = {
        GET: req.query,
        predicate,
        metrics,
        esBody
      };

      res.json({
        ...result,
        ...(includeMeta && { meta }),
      });
    } catch (err) {
      next(err);
    }
  }
}

function parseQuery(req, res, next, { get2predicate, get2metric }) {
  try {
    // get body from POST or GET
    let body = req.body || {};
    // if GET and body in url, then use that
    if (req.method === 'GET' && req.query.body) {
      try {
        body = JSON.parse(req.query.body);
      } catch (err) {
        return next(new ResponseError(400, 'badRequest', `Malformed body`));
      }
    }
    
    // take anything but the body from the url query
    const { body: getBody, ...getQuery } = req.query;
    // then merge body (from POST or GET) with the url params giving preference to the body
    const query = {...getQuery, ...body};

    const { 
      predicate: jsonPredicate, 
      metrics: jsonMetrics, 
      size = 20, 
      from = 0, 
      includeMeta = false, 
      ...otherParams 
    } = query;
    
    // get any metrics and predicate defined in v1 style. 
    let v1Predicate = get2predicate(otherParams);
    let v1Metrics = get2metric(otherParams);

    // merge get style and post style metrics request, giving priority to post style as that is more precise
    let metrics = Object.assign({}, v1Metrics, jsonMetrics)

    // AND queries: If user sends both post style and v1 style query, then join them with an "add" predicate
    if (jsonPredicate && v1Predicate) {
      predicate = { type: 'and', predicates: [jsonPredicate, v1Predicate] }
    } else {
      // if both aren't set, then choose which ever is set
      predicate = v1Predicate ? v1Predicate : jsonPredicate;
    }

    const intSize = parseInt(size);
    const intFrom = parseInt(from);
    const result = { metrics, predicate, size: intSize, from: intFrom, includeMeta };
    console.log(JSON.stringify(result, null, 2));
    return result;
  } catch (err) {
    next(err);
  }
}

function keyResource(resource) {
  const { dataSource } = resource;
  return async (req, res) => {
    const body = await dataSource.byKey({ key: req.params.id, req });
    res.json(body);
  };
}

function suggestResource(resource) {
  const { dataSource, getSuggestQuery } = resource;
  return async (req, res) => {
    const suggestQuery = getSuggestQuery({ key: req.params.key, text: req.query.q });
    const body = await dataSource.suggest(suggestQuery);
    res.json(body);
  };
}

function postMetaOnly(resource) {
  const { predicate2query } = resource;
  return async (req, res) => {
    const predicate = req.body.predicate;
    const query = predicate2query(predicate);
    const meta = {
      predicate,
      query
    };

    res.json(meta);
  }
}

function getMetaOnly(resource) {
  const { get2predicate, predicate2query } = resource;
  return async (req, res, next) => {
    let predicate;
    let metrics;
    if (req.query.query) {
      try {
        const jsonQuery = JSON.parse(req.query.query);
        predicate = jsonQuery.predicate;
      } catch (err) {
        return next(new ResponseError(400, 'badRequest', `Invalid query: ${err.message}`));
      }
    } else {
      predicate = get2predicate(req.query);
    }
    const query = predicate2query(predicate);
    const meta = {
      predicate,
      query
    };

    res.json(meta);
  }
}

app.get('*', unknownRouteHandler);
app.use(errorHandler);

app.listen({ port: config.port }, () =>
  console.log(`🚀 Server ready at http://localhost:${config.port}`)
);
