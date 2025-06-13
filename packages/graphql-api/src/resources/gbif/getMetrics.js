/* eslint-disable camelcase */
import config from '../../config';

const DEFAULT_CHECKLIST_KEY =
  config.defaultChecklist ?? 'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c'; // Backbone key for classification

/**
 * Convinent wrapper to generate the facet resolvers.
 * Given a string (facet name) then generate a query and map the result
 * @param {String} field
 */
const getFacet =
  (field, getSearchFunction) =>
  (
    parent,
    { size = 10, from = 0, include, checklistKey = DEFAULT_CHECKLIST_KEY },
    { dataSources },
  ) => {
    // get SearchAPI
    const searchApi = getSearchFunction(dataSources);
    // generate the occurrence search facet query, by inherting from the parent query, and map limit/offset to facet equivalents
    const query = {
      predicate: parent._predicate,
      q: parent._q,
      size: 0,
      metrics: {
        facet: {
          type: 'facet',
          key: field,
          size,
          from,
          include,
          checklistKey,
        },
      },
    };
    // query the API, and throw away anything but the facet counts
    return searchApi({ query }).then((data) => {
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
          _q: parent._q,
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
  (field, getSearchFunction) =>
  (parent, args, { dataSources }) => {
    // get SearchAPI
    const searchApi = getSearchFunction(dataSources);
    // generate the occurrence search facet query, by inherting from the parent query, and map limit/offset to facet equivalents
    const query = {
      predicate: parent._predicate,
      q: parent._q,
      size: 0,
      metrics: {
        stats: {
          type: 'stats',
          key: field,
        },
      },
    };
    // query the API, and throw away anything but the facet counts
    return searchApi({ query }).then((data) => data.aggregations.stats);
  };

/**
 * Convinent wrapper to generate the stat resolvers.
 * Given a string (field name) then generate a query and map the result
 * @param {String} field
 */
const getCardinality =
  (field, getSearchFunction) =>
  (
    parent,
    { precision_threshold = 10000, checklistKey = DEFAULT_CHECKLIST_KEY },
    { dataSources },
  ) => {
    // get SearchAPI
    const searchApi = getSearchFunction(dataSources);
    // generate the occurrence search facet query, by inherting from the parent query, and map limit/offset to facet equivalents
    const query = {
      predicate: parent._predicate,
      q: parent._q,
      size: 0,
      metrics: {
        cardinality: {
          type: 'cardinality',
          key: field,
          precision_threshold,
          checklistKey,
        },
      },
    };
    // query the API, and throw away anything but the facet counts
    return searchApi({ query })
      .then((data) => data.aggregations.cardinality.value)
      .catch((err) => {
        console.log(err);
      });
  };

/**
 * Convinent wrapper to generate the histogram resolvers.
 * Given a string (field name) then generate a query and map the result
 * @param {String} field
 */
const getHistogram =
  (field, getSearchFunction) =>
  (parent, { interval = 45 }, { dataSources }) => {
    // get SearchAPI
    const searchApi = getSearchFunction(dataSources);
    // generate the occurrence search facet query, by inherting from the parent query, and map limit/offset to facet equivalents
    const query = {
      predicate: parent._predicate,
      q: parent._q,
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
    return searchApi({ query }).then((data) => ({
      interval,
      ...data.aggregations.histogram,
    }));
  };

/**
 * Convinent wrapper to generate the histogram resolvers.
 * Given a string (field name) then generate a query and map the result
 * @param {String} field
 */
const getAutoDateHistogram =
  (field, getSearchFunction) =>
  (parent, { buckets = 10, minimum_interval }, { dataSources }) => {
    // get SearchAPI
    const searchApi = getSearchFunction(dataSources);
    // generate the occurrence search facet query, by inherting from the parent query, and map limit/offset to facet equivalents
    const query = {
      predicate: parent._predicate,
      q: parent._q,
      size: 0,
      metrics: {
        autoDateHistogram: {
          type: 'auto_date_histogram',
          minimum_interval,
          key: field,
          buckets,
        },
      },
    };
    // query the API, and throw away anything but the facet counts
    return searchApi({ query }).then((data) => ({
      bucketSize: buckets,
      ...data.aggregations.autoDateHistogram,
      buckets: data.aggregations.autoDateHistogram.buckets.map((x) => ({
        ...x,
        date: x.key_as_string,
        count: x.doc_count,
      })),
    }));
  };

export {
  getAutoDateHistogram,
  getCardinality,
  getFacet,
  getHistogram,
  getStats,
};
