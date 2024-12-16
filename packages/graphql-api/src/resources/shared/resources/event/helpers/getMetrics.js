/**
 * Convinent wrapper to generate the facet resolvers.
 * Given a string (facet name) then generate a query and map the result
 * @param {String} field
 */
const getFacet =
  (field) =>
  (parent, { size = 10, from = 0, include }, { dataSources }) => {
    // generate the event search facet query, by inheriting from the parent query, and map limit/offset to facet equivalents
    const query = {
      predicate: parent._predicate,
      size: 0,
      metrics: {
        facet: {
          type: 'facet',
          key: field,
          size,
          from,
          include,
        },
      },
    };
    // query the API, and throw away anything but the facet counts
    return dataSources.eventAPI.searchEvents({ query }).then((data) => {
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

const getMultiFacet = (
  { _predicate, size, from },
  {},
  { searchApi, fields },
) => {
  // generate the event search facet query, by inheriting from the parent query, and map limit/offset to facet equivalents
  const query = {
    predicate: _predicate,
    size: 0,
    metrics: {
      multifacet: {
        type: 'multifacet',
        keys: fields,
        size: size,
        from: from,
      },
    },
  };
  // query the API, and throw away anything but the facet counts
  return searchApi({ query }).then((data) => {
    return data.aggregations.multifacet.buckets.map((bucket) => {
      const predicate = {
        type: 'equals',
        key: fields[0],
        value: bucket.key[0],
      };
      const joinedPredicate = data.meta.predicate
        ? {
            type: 'and',
            predicates: [data.meta.predicate, predicate],
          }
        : predicate;
      return {
        keys: bucket.key,
        count: bucket.doc_count,
        // create a new predicate that joins the base with the facet. This enables us to dig deeper for multidimensional metrics
        _predicate: joinedPredicate,
        _parentPredicate: data.meta.predicate,
      };
    });
  });
};

const getOccurrenceFacet =
  (field) =>
  (parent, { size = 10, include }, { dataSources }) => {
    // generate the event search facet query, by inheriting from the parent query, and map limit/offset to facet equivalents
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
    return dataSources.eventAPI.searchOccurrences({ query }).then((data) => {
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
 * Convinent wrapper to generate the facet resolvers.
 * Given a string (facet name) then generate a query and map the result
 * @param {String} field
 */
const getTemporal =
  (field) =>
  (parent, { size = 30, from = 0 }, { dataSources }) => {
    // generate the event search facet query, by inherting from the parent query, and map limit/offset to facet equivalents
    const query = {
      predicate: parent._predicate,
      size: 0,
      metrics: {
        facet: {
          type: 'facet',
          key: field,
          size,
          from,
          metrics: {
            year_facet: {
              type: 'facet',
              key: 'year',
              order: 'TERM_ASC',
              metrics: {
                month_facet: {
                  type: 'facet',
                  key: 'month',
                  order: 'TERM_ASC',
                },
              },
            },
          },
        },
        cardinality: {
          type: 'cardinality',
          key: field,
        },
      },
    };
    // query the API, and throw away anything but the facet counts
    return dataSources.eventAPI.searchEvents({ query }).then((data) => {
      return {
        cardinality: data.aggregations.cardinality.value,
        results: data.aggregations.facet.buckets.map((bucket) => {
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

          const years = bucket.year_facet.buckets.map((obj) => ({
            y: obj.key,
            c: obj.doc_count,
            ms: obj.month_facet.buckets.map((monthBucket) => ({
              m: monthBucket.key,
              c: monthBucket.doc_count,
            })),
          }));

          return {
            key: bucket.key,
            count: bucket.doc_count,
            breakdown: years,
            // create a new predicate that joins the base with the facet. This enables us to dig deeper for multidimensional metrics
            _predicate: joinedPredicate,
            _parentPredicate: data.meta.predicate,
          };
        }),
      };
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
    // generate the event search facet query, by inherting from the parent query, and map limit/offset to facet equivalents
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
    return dataSources.eventAPI
      .searchEvents({ query })
      .then((data) => data.aggregations.stats);
  };

/**
 * Convinent wrapper to generate the stat resolvers.
 * Given a string (field name) then generate a query and map the result
 * @param {String} field
 */
const getCardinality = (
  predicate,
  { precision_threshold: precisionThreshhold = 10000 },
  { searchApi, field },
) => {
  // generate the event search facet query, by inherting from the parent query, and map limit/offset to facet equivalents
  const query = {
    predicate,
    size: 0,
    metrics: {
      cardinality: {
        type: 'cardinality',
        key: field,
        precision_threshold: precisionThreshhold,
      },
    },
  };
  // query the API, and throw away anything but the facet counts
  return searchApi({ query }).then(
    (data) => data.aggregations.cardinality.value,
  );
};

/**
 * Convinent wrapper to generate the histogram resolvers.
 * Given a string (field name) then generate a query and map the result
 * @param {String} field
 */
const getHistogram =
  (field) =>
  (parent, { interval = 45 }, { dataSources }) => {
    // generate the event search facet query, by inherting from the parent query, and map limit/offset to facet equivalents
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
    return dataSources.eventAPI
      .searchEvents({ query })
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
    // generate the event search facet query, by inherting from the parent query, and map limit/offset to facet equivalents
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
    return dataSources.eventAPI
      .searchEvents({ query })
      .then((data) => ({ buckets, ...data.aggregations.autoDateHistogram }));
  };

export {
  getFacet,
  getMultiFacet,
  getOccurrenceFacet,
  getStats,
  getCardinality,
  getHistogram,
  getAutoDateHistogram,
  getTemporal,
};
