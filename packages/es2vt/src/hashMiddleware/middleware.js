/*
GraphQL allows both GET and POST queries, 
but GET queries easily gets very large when sending queryies and variables along.
And the browsers has a maximum size. So to ease browser caching we allow sending and registering a hash of the query or variables.
Since the queries are largest and mostly reused, that means we can typically get away with registering it once for all users.

First user:
GET queryID: 123
server looks up ID, it is unknown
response: unknownID
The client detect that, POST the query and get the response back

Second user: 
Get queryID: 123
finds queryID in cache, attach it to the request and the request is processed as usual

Third user:
Get queryID: 123
If there is varnish (or other cache) installed, then the GET request from user2 is already in cache and returned.
*/
const hash = require('object-hash');
const { queryCache, variablesCache } = require('./cache');

function sendHashError(req, res, next, message) {
  res.set('Cache-Control', 'no-store');
  res.status(400).json(message);
}

const hashMiddleware = function (req, res, next) {
  // When the user provides a hash instead of a query or variables
  // then look it up or return a 404 asking for the full query/variables for future reference

  // extract based on POST or GET
  const isPOST = req.method === 'POST';
  const query = isPOST ? req.body.query : req.query.query;
  const queryId = isPOST ? req.body.queryId : req.query.queryId;

  // used to track if the provided ids are unknown
  let unknownQueryId;

  // if query or variables are provided, then hash for future reference
  if (query) {
    const queryKey = hash(query);
    queryCache.set(queryKey, query);
    res.set('X-query-ID', queryKey);
    if (queryId && queryId !== queryKey) {
      // A hash has been provided that conflicts with the server hash. return an error
      return sendHashError(req, res, next, {error: 'HASH_QUERY_CONFLICT'});
    }
  }

  // if no query is provided but a hash is, then try to look it up
  if (!query && queryId) {
    const storedQuery = queryCache.get(queryId);
    if (!storedQuery) {
      unknownQueryId = true;
      console.log('no stored query')
    } else {
      if (req.method === 'POST') req.body.query = storedQuery;
      if (req.method === 'GET') req.query.query = storedQuery;
    }
  }

  // if either hash is unknown, then return with an error asking the client to return the full value
  if (unknownQueryId) {
    return sendHashError(req, res, next, {
      unknownQueryId
    });
  }
  
  next();
}

module.exports = hashMiddleware;