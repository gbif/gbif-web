/* eslint-disable camelcase */
/**
 * Convinent wrapper to generate the facet resolvers.
 * Given a string (facet name) then generate a query and map the result
 * @param {String} field
 */
const getFacet =
  (field) =>
  (parent, { size = 10, from = 0, checklistKey, include }, { dataSources }) => {
    // generate the occurrence search facet query, by inherting from the parent query, and map limit/offset to facet equivalents
    const query = {
      predicate: parent._predicate,
      q: parent._q,
      size: 0,
      metrics: {
        facet: {
          type: 'facet',
          key: field,
          checklistKey,
          size,
          from,
          include,
        },
      },
    };
    // query the API, and throw away anything but the facet counts
    return dataSources.occurrenceAPI
      .searchOccurrences({ query })
      .then((data) => {
        /*
        custom rule for overwriting field names in the constructed predicate for sub queries
        when continuin to occurrence search for taxon keys, we should always use the taxonKey field not the field e.g. usageKey or familyKey
        */
        const replaceWithTaxonKey = [
          'acceptedUsageKey',
          'acceptedTaxonKey',
          'usageKey',
          'genusKey',
          'speciesKey',
          'familyKey',
          'orderKey',
          'classKey',
          'phylumKey',
          'kingdomKey',
        ];
        const fieldForPredicate = replaceWithTaxonKey.includes(field)
          ? 'taxonKey'
          : field;
        return data.aggregations.facet.buckets.map((bucket) => {
          const predicate = {
            type: 'equals',
            key: fieldForPredicate,
            value: bucket.key,
            checklistKey,
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
  (field) =>
  (parent, args, { dataSources }) => {
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
      q: parent._q,
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
  (parent, { buckets = 10, minimum_interval }, { dataSources }) => {
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
    return dataSources.occurrenceAPI
      .searchOccurrences({ query })
      .then((data) => ({
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
