import { NextFunction, Request, Response } from 'express';
import LRU from 'lru-cache';
import hash from 'object-hash';
import { ParsedQs } from 'qs';

const queryCache = new LRU({ max: 1000 });
const variablesCache = new LRU({ max: 10000 });

type StoredQuery = string | ParsedQs | string[] | ParsedQs[] | undefined;

function sendHashError(
  req: Request,
  res: Response,
  next: NextFunction,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message: Record<string, any>,
) {
  const isStrict =
    typeof req.query.strict === 'string' && req.query.strict !== 'false';
  if (isStrict) {
    res.set('Cache-Control', 'no-store');
    res.status(400).json(message);
  } else {
    next();
  }
}

// eslint-disable-next-line consistent-return
const hashMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // When the user provides a hash instead of a query or variables
  // then look it up or return a 404 asking for the full query/variables for future reference

  // extract based on POST or GET
  const isPOST = req.method === 'POST';
  const query = isPOST ? req.body.query : req.query.query;
  const queryId = isPOST ? req.body.queryId : req.query.queryId;
  const { variables } = req.body; // Do not cache variables that come as GET
  const variablesId = isPOST ? req.body.variablesId : req.query.variablesId;

  // used to track if the provided ids are unknown
  let unknownQueryId;
  let unknownVariablesId;

  // if query or variables are provided, then hash for future reference
  if (query) {
    const queryKey = hash(query);
    queryCache.set(queryKey, query);
    res.set('X-Graphql-query-ID', queryKey);
    if (queryId && queryId !== queryKey) {
      // A hash has been provided that conflicts with the server hash. return an error
      return sendHashError(req, res, next, { error: 'HASH_QUERY_CONFLICT' });
    }
  }
  if (variables) {
    const variablesKey = hash(variables);
    variablesCache.set(variablesKey, variables);
    res.set('X-Graphql-variables-ID', variablesKey);
    if (variablesId && variablesId !== variablesKey) {
      // A hash has been provided that conflicts with the server hash. return an error
      return sendHashError(req, res, next, {
        error: 'HASH_VARIABLES_CONFLICT',
      });
    }
  }

  // if no query is provided but a hash is, then try to look it up
  if (!query && queryId) {
    const storedQuery = queryCache.get(queryId);
    if (!storedQuery) {
      unknownQueryId = true;
    } else {
      res.set('X-Graphql-query-ID', queryId);
      if (req.method === 'POST') req.body.query = storedQuery;
      if (req.method === 'GET') req.query.query = storedQuery as StoredQuery;
    }
  }
  // if no variables is provided but a hash is, then try to look it up
  if (!variables && variablesId) {
    const storedVariables = variablesCache.get(variablesId);
    if (!storedVariables) {
      unknownVariablesId = true;
    } else {
      res.set('X-Graphql-variables-ID', variablesId);
      if (req.method === 'POST') req.body.variables = storedVariables;
      if (req.method === 'GET')
        req.query.variables = storedVariables as StoredQuery;
    }
  }

  // if either hash is unknown, then return with an error asking the client to return the full value
  if (unknownQueryId || unknownVariablesId) {
    return sendHashError(req, res, next, {
      unknownQueryId,
      unknownVariablesId,
    });
  }

  next();
};

export default hashMiddleware;
