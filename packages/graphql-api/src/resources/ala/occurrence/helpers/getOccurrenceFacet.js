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

export default getOccurrenceFacet;
