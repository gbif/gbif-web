const express = require('express');
const config = require('./config');
const { literature, normalizeGetQuery } = require('./resources/literature');
const { asyncMiddleware, errorHandler, unknownRouteHandler } = require('./resources/errorHandler');

const app = express();

app.post('/literature', asyncMiddleware(async (req, res) => {
  const body = await literature.literatureQuery({ query: req.query.body });
  res.json(body);
}));

app.get('/literature', asyncMiddleware(async (req, res) => {
  const query = normalizeGetQuery(req.query);
  console.log(JSON.stringify(query, null, 2));
  const body = await literature.literatureQuery({ query });
  res.json({
    _query: req.query,
    ...body
  });
}));

app.get('/literature/:id', asyncMiddleware(async (req, res) => {
  const body = await literature.literatureKey({ id: req.params.id });
  res.json(body);
}));

app.get('*', unknownRouteHandler);
// app.use(errorHandler);

app.listen({ port: config.port }, () =>
  console.log(`🚀 Server ready at http://localhost:${config.port}`)
);


const query = {
  // datasetKey: [1, 2, 3],
  // nodeTitle: 'Hello you',
  // year: ['*', '2'],
  // '!issue': ['FUZZY_MATCH', 'INVALID_COUNTRY'],
  q: 'str'
}
const preQuery = {
  countryCode: 'DK'
}
