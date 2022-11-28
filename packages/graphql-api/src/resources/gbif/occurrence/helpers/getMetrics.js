/* eslint-disable camelcase */
/**
 * Convinent wrapper to generate the facet resolvers.
 * Given a string (facet name) then generate a query and map the result
 * @param {String} field
 */
const getFacet =
  (field) =>
  (parent, { size = 10, include }, { dataSources }) => {
    // generate the occurrence search facet query, by inherting from the parent query, and map limit/offset to facet equivalents
    const query = {
      predicate: parent._predicate,
      size: 0,
      metrics: {
        facet: {
          type: 'facet',
          key: field,
          size,
          include,
        },
      },
    };
    // query the API, and throw away anything but the facet counts
    return dataSources.occurrenceAPI
      .searchOccurrences({ query })
      .then((data) => {
        return data.aggregations.facet.buckets.map((bucket) => {
          const predicate = {
            type: 'equals',
            key: field,
            value: bucket.key,
          };
          const joinedPredicate = data.meta.predicate
            ? {
                type: 'and',
                predicates: [data.meta.predicate, predicate],
              }
            : predicate;
          return {
            key: bucket.key,
            count: bucket.doc_count,
            // create a new predicate that joins the base with the facet. This enables us to dig deeper for multidimensional metrics
            _predicate: joinedPredicate,
            _parentPredicate: data.meta.predicate,
          };
        });
      });
  };

/**
 * Convinent wrapper to generate the stat resolvers.
 * Given a string (field name) then generate a query and map the result
 * @param {String} field
 */
const getStats =
  (field) =>
  (parent, args, { dataSources }) => {
    // generate the occurrence search facet query, by inherting from the parent query, and map limit/offset to facet equivalents
    const query = {
      predicate: parent._predicate,
      size: 0,
      metrics: {
        stats: {
          type: 'stats',
          key: field,
        },
      },
    };
    // query the API, and throw away anything but the facet counts
    return dataSources.occurrenceAPI
      .searchOccurrences({ query })
      .then((data) => data.aggregations.stats);
  };

/**
 * Convinent wrapper to generate the stat resolvers.
 * Given a string (field name) then generate a query and map the result
 * @param {String} field
 */
const getCardinality =
  (field) =>
  (parent, { precision_threshold = 10000 }, { dataSources }) => {
    // generate the occurrence search facet query, by inherting from the parent query, and map limit/offset to facet equivalents
    const query = {
      predicate: parent._predicate,
      size: 0,
      metrics: {
        cardinality: {
          type: 'cardinality',
          key: field,
          precision_threshold,
        },
      },
    };
    // query the API, and throw away anything but the facet counts
    return dataSources.occurrenceAPI
      .searchOccurrences({ query })
      .then((data) => data.aggregations.cardinality.value);
  };

/**
 * Convinent wrapper to generate the histogram resolvers.
 * Given a string (field name) then generate a query and map the result
 * @param {String} field
 */
const getHistogram =
  (field) =>
  (parent, { interval = 45 }, { dataSources }) => {
    // generate the occurrence search facet query, by inherting from the parent query, and map limit/offset to facet equivalents
    const query = {
      predicate: parent._predicate,
      size: 0,
      metrics: {
        histogram: {
          type: 'histogram',
          key: field,
          interval,
        },
      },
    };
    // query the API, and throw away anything but the facet counts
    return dataSources.occurrenceAPI
      .searchOccurrences({ query })
      .then((data) => ({ interval, ...data.aggregations.histogram }));
  };

/**
 * Convinent wrapper to generate the histogram resolvers.
 * Given a string (field name) then generate a query and map the result
 * @param {String} field
 */
const getAutoDateHistogram =
  (field) =>
  (parent, { buckets = 10 }, { dataSources }) => {
    // generate the occurrence search facet query, by inherting from the parent query, and map limit/offset to facet equivalents
    const query = {
      predicate: parent._predicate,
      size: 0,
      metrics: {
        autoDateHistogram: {
          type: 'auto_date_histogram',
          key: field,
          buckets,
        },
      },
    };
    // query the API, and throw away anything but the facet counts
    return dataSources.occurrenceAPI
      .searchOccurrences({ query })
      .then((data) => ({ buckets, ...data.aggregations.autoDateHistogram }));
  };

export {
  getFacet,
  getStats,
  getCardinality,
  getHistogram,
  getAutoDateHistogram,
};
