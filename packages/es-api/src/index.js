const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const literature = require('./resources/literature');
const occurrence = require('./resources/occurrence');
const dataset = require('./resources/dataset');
const { asyncMiddleware, ResponseError, errorHandler, unknownRouteHandler } = require('./resources/errorHandler');

const app = express();
app.use(bodyParser.json())

const _ = require('lodash');
const temporaryAuthMiddleware = function (req, res, next) {
  const apiKey = _.get(req, 'query.apiKey');
  if (!apiKey) {
    next(new ResponseError(401, 'temporaryAuthentication', 'You need to provide an apiKey in the url'));
  } else if (apiKey !== config.API_KEY || !config.API_KEY) {
    next(new ResponseError(403, 'temporaryAuthentication', `Invalid apiKey: ${apiKey}`));
  }
  // the apiKey shouldn't be used elsewhere and shouldn't be interpreted as a es query param
  delete req.query.apiKey;
  // Pass to next layer of middleware
  next()
}
app.use(temporaryAuthMiddleware)

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  // Pass to next layer of middleware
  next();
});

app.post('/literature', asyncMiddleware(postResource(literature)));
app.get('/literature', asyncMiddleware(getResource(literature)));
app.get('/literature/key/:id', asyncMiddleware(keyResource(literature)));

app.post('/occurrence', asyncMiddleware(postResource(occurrence)));
app.get('/occurrence', asyncMiddleware(getResource(occurrence)));
app.get('/occurrence/key/:id', asyncMiddleware(keyResource(occurrence)));
app.get('/occurrence/suggest/:key', asyncMiddleware(suggestResource(occurrence)));

app.post('/dataset', asyncMiddleware(postResource(dataset)));
app.get('/dataset', asyncMiddleware(getResource(dataset)));
app.get('/dataset/key/:id', asyncMiddleware(keyResource(dataset)));

function postResource(resource) {
  const { dataSource, predicate2query, metric2aggs} = resource;
  return async (req, res) => {
    const size = req.body.size;
    const includeMeta = req.body.meta;
    const from = req.body.from;
    const predicate = req.body.query;
    const metrics = req.body.metrics;
    const aggs = metrics ? metric2aggs(metrics) : {};
    const query = predicate2query(predicate);
    const { result, esBody } = await dataSource.query({ query, aggs, size, from });
    const meta = {
      predicate,
      metrics,
      esBody
    };

    res.json({
      ...(includeMeta && { meta }),
      ...result
    });
  }
}

function getResource(resource) {
  const { dataSource, get2predicate, predicate2query, get2metric, metric2aggs} = resource;
  return async (req, res, next) => {
    let predicate;
    let metrics;
    if (req.query.query) {
      try {
        const jsonQuery = JSON.parse(req.query.query);
        predicate = jsonQuery.predicate;
        metrics = jsonQuery.metrics;
      } catch(err) {
        return next(new ResponseError(400, 'badRequest', `Invalid query: ${err.message}`));
      }
    } else {
      predicate = get2predicate(req.query);
      metrics = get2metric(req.query);
    }
    const aggs = metric2aggs(metrics);
    const query = predicate2query(predicate);
    const size = req.query.size;
    const from = req.query.from;
    const includeMeta = req.query.includeMeta;
    const { result, esBody } = await dataSource.query({ query, aggs, size, from });
    const meta = {
      GET: req.query,
      predicate,
      metrics,
      esBody
    };

    res.json({
      ...(includeMeta && { meta }),
      ...result
    });
  }
}

function keyResource(resource) {
  const { dataSource } = resource;
  return async (req, res) => {
    const body = await dataSource.byKey({ key: req.params.id });
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

app.get('*', unknownRouteHandler);
app.use(errorHandler);

app.listen({ port: config.port }, () =>
  console.log(`🚀 Server ready at http://localhost:${config.port}`)
);
