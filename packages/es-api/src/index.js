const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const _ = require('lodash');
const cors = require('cors');
const config = require('./config');
var queue = require('express-queue');
const { loggingMiddleware, errorLoggingMiddleware, admissionGate } = require('./middleware');
const { randomUUID } = require('crypto');
const { requestContextStorage } = require('./requestContext');
const {
  registerQueue,
  registerGate,
  recordRejection,
  recordAdmit,
  recordComplete,
  trackInflight,
  getInflight,
  getQueueSizes,
} = require('./health/metrics');
const health = require('./health');
const { setPeakSnapshotProvider } = require('./health/eventLoop');
const adminController = require('./admin');

// When a new worst event-loop stall is recorded, fold in what the service was
// doing (inflight + queue sizes) so /health and the log line can explain it.
setPeakSnapshotProvider(() => ({
  inflight: getInflight(),
  queues: getQueueSizes(),
}));
const normalizePredicate = require('./requestAdapter/util/normalizePredicate');

const ACTIVE_LIMIT = 20;
const OCCURRENCE_ACTIVE_LIMIT = 20;
const QUEUED_LIMIT = 2000;

function rejectResponse(res) {
  res.status(429);
  res.json({
    error: 429,
    message:
      'Too many concurrent requests. This threshold is shared across users. Please retry your request later.',
  });
}

// Create an express-queue for an endpoint and register it with /health under
// `name`.
function makeQueue(name, concurrencyLimit = ACTIVE_LIMIT) {
  // Held by reference: express-queue (internally uses mini-queue) reads activeLimit/queuedLimit off this object
  // live on every admission decision, so the admin endpoint can retune the
  // queue at runtime by mutating it (see metrics.setQueueLimits).
  const queueConfig = {
    activeLimit: concurrencyLimit,
    queuedLimit: QUEUED_LIMIT,
    rejectHandler: (req, res) => {
      recordRejection(name);
      rejectResponse(res);
    },
  };
  const q = queue(queueConfig);

  const middleware = (req, res, next) => {
    q(req, res, (err) => {
      if (err) {
        next(err);
        return;
      }
      // A request has acquired a slot and is now running.
      // Bump the counter and set up hooks to know how it finished.
      recordAdmit(name);
      let settled = false;
      const finalize = (outcome) => {
        if (settled) return;
        settled = true;
        recordComplete(name, outcome);
      };
      res.once('finish', () => finalize(res.statusCode >= 400 ? 'failed' : 'served'));
      res.once('close', () => finalize('aborted'));
      next();
    });
  };
  // Preserve the introspection handle the gate and /health read.
  middleware.queue = q.queue;

  // this is only to support the health endpoint.
  registerQueue(
    name,
    middleware,
    {
      concurrencyLimit,
      maxQueueSize: QUEUED_LIMIT,
    },
    queueConfig,
  );
  return middleware;
}

// Occurrence search is the heaviest, most contended upstream. In fron of the queue
// we add a gate that rejects low-priority requests when the backlog is deep.
// we do not reject requests already in the queue, just new arrivals.
const occurrenceQueue = makeQueue('occurrence', OCCURRENCE_ACTIVE_LIMIT);
const occurrenceGate = admissionGate({
  getQueueLength: () => occurrenceQueue.queue.getLength(),
  shedBands: _.get(config, 'queue.shedBands', []), // e.g. if queue above 30, then shed priority > 50 etc.
  defaultPriority: _.get(config, 'queue.defaultPriority', 100),
  rejectHandler: (req, res) => {
    recordRejection('occurrence');
    rejectResponse(res);
  },
});
// register the gate with a reference. It is mutable so we can adjust without a restart
registerGate('occurrence', occurrenceGate);

let content, literature, occurrence, eventOccurrence, dataset, event;
if (config.content) {
  content = require('./resources/content');
}
if (config.content) {
  literature = require('./resources/literature');
}
if (config.eventOccurrence) {
  eventOccurrence = require('./resources/eventOccurrence');
}
if (config.occurrence) {
  occurrence = require('./resources/occurrence');
}
if (config.dataset) {
  dataset = require('./resources/dataset');
}
if (config.event) {
  event = require('./resources/event');
}
const {
  asyncMiddleware,
  ResponseError,
  errorHandler,
  unknownRouteHandler,
} = require('./resources/errorHandler');

const app = express();
app.use(cors());
app.use(compression());
// Open a request-scoped store so logger.js can stamp every log line for this
// request. Reuse the upstream x-request-id (forwarded by graphql-api) so logs
// correlate across services; generate one for direct callers.
app.use((req, _res, next) => {
  requestContextStorage.run(
    {
      requestId: req.headers['x-request-id'] || randomUUID(),
      siteUrl: req.headers['x-gbif-site-url'] || null,
    },
    () => next(),
  );
});
app.use(express.static('public'));
app.use(bodyParser.json({ limit: '1mb' }));

let setCache = function (req, res, next) {
  const period = 600; // unit seconds
  // if GET request, then add caching
  if (req.method == 'GET') {
    res.set('Cache-control', `public, max-age=${period}`);
  }
  // call next() to pass on the request
  next();
};
if (!config.debug) {
  // use cache middleware
  app.use(setCache);
}

// Add logging middleware
app.use(loggingMiddleware);

// Count every request as service-wide in-flight while it is handled (for
// /health). Must run before the route handlers; /health itself is excluded.
app.use(trackInflight);

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  // Pass to next layer of middleware
  next();
});

const temporaryAuthMiddleware = function (req, res, next) {
  const apiKey =
    _.get(req, 'query.apiKey') ||
    _.get(req, 'body.apiKey') ||
    _.get(req, 'headers.Authorization', '').substr(10) ||
    _.get(req, 'headers.authorization', '').substr(10);
  if (!apiKey) {
    next(
      new ResponseError(401, 'temporaryAuthentication', 'You need to provide an apiKey in the url'),
    );
  } else if (apiKey !== config.apiKey || !config.apiKey) {
    next(new ResponseError(403, 'temporaryAuthentication', `Invalid apiKey: ${apiKey}`));
  }
  // the apiKey shouldn't be used elsewhere and shouldn't be interpreted as a es query param
  delete req.query.apiKey;
  // Pass to next layer of middleware
  next();
};
// use per route instead
// app.use(temporaryAuthMiddleware)

if (content) {
  const contentQueue = makeQueue('content');
  app.post('/content/meta', asyncMiddleware(metaOnly(content)));
  app.get('/content/meta', asyncMiddleware(metaOnly(content)));

  app.post('/content', contentQueue, asyncMiddleware(searchResource(content)));
  app.get('/content', contentQueue, asyncMiddleware(searchResource(content)));
  app.get('/content/key/:id', asyncMiddleware(keyResource(content)));
}

if (literature) {
  const literatureQueue = makeQueue('literature');
  app.post('/literature/meta', asyncMiddleware(metaOnly(literature)));
  app.get('/literature/meta', asyncMiddleware(metaOnly(literature)));

  app.post('/literature', literatureQueue, asyncMiddleware(searchResource(literature)));
  app.get('/literature', literatureQueue, asyncMiddleware(searchResource(literature)));
  app.get('/literature/key/:id', asyncMiddleware(keyResource(literature)));
}

if (occurrence) {
  app.post('/occurrence/meta', asyncMiddleware(metaOnly(occurrence)));
  app.get('/occurrence/meta', asyncMiddleware(metaOnly(occurrence)));

  app.post(
    '/occurrence',
    occurrenceGate,
    occurrenceQueue,
    temporaryAuthMiddleware,
    asyncMiddleware(searchResource(occurrence)),
  );
  app.get(
    '/occurrence',
    occurrenceGate,
    occurrenceQueue,
    temporaryAuthMiddleware,
    asyncMiddleware(searchResource(occurrence)),
  );
  app.get('/occurrence/key/:id', asyncMiddleware(keyResource(occurrence)));

  app.post('/occurrence/suggest/datasetKey', asyncMiddleware(occurrence.suggestDatasetKey));
  app.post('/occurrence/suggest/publisherKey', asyncMiddleware(occurrence.suggestPublisherKey));

  app.get(
    '/occurrence/suggest/:key',
    temporaryAuthMiddleware,
    asyncMiddleware(suggestResource(occurrence)),
  );
}

if (eventOccurrence) {
  const eventOccurrenceQueue = makeQueue('event-occurrence');
  app.post('/event-occurrence/meta', asyncMiddleware(metaOnly(eventOccurrence)));
  app.get('/event-occurrence/meta', asyncMiddleware(metaOnly(eventOccurrence)));

  app.post(
    '/event-occurrence',
    eventOccurrenceQueue,
    temporaryAuthMiddleware,
    asyncMiddleware(searchResource(eventOccurrence)),
  );
  app.get(
    '/event-occurrence',
    eventOccurrenceQueue,
    temporaryAuthMiddleware,
    asyncMiddleware(searchResource(eventOccurrence)),
  );
  app.get('/event-occurrence/key/:id', asyncMiddleware(keyResource(eventOccurrence)));

  app.get(
    '/event-occurrence/suggest/:key',
    temporaryAuthMiddleware,
    asyncMiddleware(suggestResource(eventOccurrence)),
  );
}

if (dataset) {
  const datasetQueue = makeQueue('dataset');
  app.post(
    '/dataset',
    datasetQueue,
    temporaryAuthMiddleware,
    asyncMiddleware(searchResource(dataset)),
  );
  app.get(
    '/dataset',
    datasetQueue,
    temporaryAuthMiddleware,
    asyncMiddleware(searchResource(dataset)),
  );
  app.get('/dataset/key/:id', asyncMiddleware(keyResource(dataset)));
}

let eventQueue;
if (event) {
  eventQueue = makeQueue('event');
  app.post('/event/meta', asyncMiddleware(metaOnly(event)));
  app.get('/event/meta', asyncMiddleware(metaOnly(event)));

  app.post('/event', eventQueue, temporaryAuthMiddleware, asyncMiddleware(searchResource(event)));
  app.get('/event', eventQueue, temporaryAuthMiddleware, asyncMiddleware(searchResource(event)));
  app.get(
    '/event/key/:qualifier/:id',
    temporaryAuthMiddleware,
    asyncMiddleware(keyResource(event)),
  );

  app.get(
    '/event/suggest/taxonKey',
    asyncMiddleware(async (req, res) => {
      const body = await event.scientificNameSuggest({ q: req.query.q, req });
      res.json(body);
    }),
  );
}

function searchResource(resource, metaOnly = false) {
  const { dataSource, get2predicate, predicate2query, get2metric, metric2aggs } = resource;
  return async (req, res, next) => {
    try {
      // console.log(`queueLength: ${eventQueue.queue.getLength()}`);
      const {
        metrics,
        predicate,
        q,
        size,
        from,
        shuffle,
        fields,
        includeMeta,
        sortBy,
        checklistKey,
        sortOrder,
        eventFiltering,
      } = parseQuery(req, res, next, { get2predicate, get2metric });

      const aggs = metric2aggs(metrics);
      const query = await predicate2query(predicate, q);
      const normalizedPredicate = normalizePredicate(predicate);
      if (metaOnly) {
        return res.json({
          predicate,
          normalizedPredicate,
          metrics,
          query,
        });
      }
      const { result, esBody } = await dataSource.query({
        query,
        aggs,
        size,
        from,
        metrics,
        shuffle,
        fields,
        sortBy,
        sortOrder,
        checklistKey,
        eventFiltering,
        req,
      });
      const meta = {
        GET: req.query,
        predicate,
        normalizedPredicate,
        metrics,
        esBody,
      };

      res.json({
        ...result,
        ...(includeMeta && { meta }),
      });
    } catch (err) {
      next(err);
    }
  };
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
    const query = { ...getQuery, ...body };

    const {
      predicate: jsonPredicate,
      metrics: jsonMetrics,
      size = 20,
      from = 0,
      shuffle,
      fields,
      includeMeta = false,
      sortBy,
      sortOrder,
      checklistKey,
      eventFiltering,
      q,
      ...otherParams
    } = query;

    // get any metrics and predicate defined in v1 style.
    let v1Predicate = get2predicate(otherParams);
    let v1Metrics = get2metric(otherParams);

    // merge get style and post style metrics request, giving priority to post style as that is more precise
    let metrics = Object.assign({}, v1Metrics, jsonMetrics);

    // AND queries: If user sends both post style and v1 style query, then join them with an "add" predicate
    if (jsonPredicate && v1Predicate) {
      predicate = { type: 'and', predicates: [jsonPredicate, v1Predicate] };
    } else {
      // if both aren't set, then choose which ever is set
      predicate = v1Predicate ? v1Predicate : jsonPredicate;
    }

    const intSize = parseInt(size);
    const intFrom = parseInt(from);
    const result = {
      metrics,
      predicate,
      size: intSize,
      from: intFrom,
      shuffle,
      fields,
      includeMeta,
      sortBy,
      sortOrder,
      checklistKey,
      eventFiltering,
      q,
    };
    return result;
  } catch (err) {
    next(err);
  }
}

function keyResource(resource) {
  const { dataSource } = resource;
  return async (req, res) => {
    const body = await dataSource.byKey({
      key: req.params.id,
      qualifier: req.params.qualifier,
      req,
    });
    res.json(body);
  };
}

function suggestResource(resource) {
  const { dataSource, getSuggestQuery } = resource;
  return async (req, res, next) => {
    const suggestQuery = getSuggestQuery({ key: req.params.key, text: req.query.q });
    const body = await dataSource.suggest(suggestQuery);
    res.json(body);
  };
}

function metaOnly(resource) {
  return searchResource(resource, true);
}

app.get('/health', health);

// Authenticated runtime settings API (log level, queue limits, shedding).
// Enforces its own admin auth via the shared GraphQL JWT.
adminController(app);

app.get('*', unknownRouteHandler);
app.use(errorHandler);
app.use(errorLoggingMiddleware);

app.listen({ port: config.port }, () =>
  console.log(`🚀 Server ready at http://localhost:${config.port}`),
);
