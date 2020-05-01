const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const literature = require('./resources/literature');
const occurrence = require('./resources/occurrence');
const dataset = require('./resources/dataset');
const { asyncMiddleware, ResponseError, errorHandler, unknownRouteHandler } = require('./resources/errorHandler');

const app = express();
app.use(bodyParser.json())

app.post('/literature', asyncMiddleware(postResource(literature)));
app.get('/literature', asyncMiddleware(getResource(literature)));
app.get('/literature/key/:id', asyncMiddleware(keyResource(literature)));

app.post('/occurrence', asyncMiddleware(postResource(occurrence)));
app.get('/occurrence', asyncMiddleware(getResource(occurrence)));
app.get('/occurrence/key/:id', asyncMiddleware(keyResource(occurrence)));

app.post('/dataset', asyncMiddleware(postResource(dataset)));
app.get('/dataset', asyncMiddleware(getResource(dataset)));
app.get('/dataset/key/:id', asyncMiddleware(keyResource(dataset)));

function postResource(resource) {
  const { dataSource, predicate2query} = resource;
  return async (req, res) => {
    const query = predicate2query(req.body);
    const { result, esBody } = await dataSource.query({ query });
    res.json({
      _query: req.query,
      _predicate: req.body,
      ...body
    });
  }
}

function getResource(resource) {
  const { dataSource, get2predicate, predicate2query, get2metric, metric2aggs} = resource;
  return async (req, res, next) => {
    let predicate;
    if (req.query.query) {
      try {
        predicate = JSON.parse(req.query.query)
      } catch(err) {
        return next(new ResponseError(400, 'badRequest', `Invalid query: ${err.message}`));
      }
    } else {
      predicate = get2predicate(req.query);
    }
    const metrics = get2metric(req.query);
    const aggs = metric2aggs(metrics);
    const query = predicate2query(predicate);
    const size = req.query.size;
    const from = req.query.from;
    const includeMeta = req.query.includeMeta;
    const { result, esBody } = await dataSource.query({ query, aggs, size, from });
    const meta = {
      getQuery: req.query,
      predicate,
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

app.get('*', unknownRouteHandler);
app.use(errorHandler);

app.listen({ port: config.port }, () =>
  console.log(`🚀 Server ready at http://localhost:${config.port}`)
);
