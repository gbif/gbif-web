/**
 * Convinent wrapper to generate the facet resolvers.
 * Given a string (facet name) then generate a query and map the result
 * @param {String} field 
 */
const getFacet = (field) =>
  (parent, { size = 10 }, { dataSources }) => {
    // generate the occurrence search facet query, by inherting from the parent query, and map limit/offset to facet equivalents
    const query = {
      predicate: parent._query,
      size: 0,
      metrics: {
        facet: {
          type: 'facet',
          key: field,
          size: size
        }
      }
    };
    // query the API, and throw away anything but the facet counts
    return dataSources.occurrenceAPI.searchOccurrences({ query })
      .then(data => {
        return data.aggregations
          .facet
          .buckets.map(bucket => ({
            key: bucket.key,
            count: bucket.doc_count,
            // create a new predicate that joins the base with the facet. This enables us to dig deeper for multidimensional metrics
            _query: {
              type: 'and',
              predicates: [
                data.meta.predicate,
                {
                  type: 'equals',
                  key: field,
                  value: bucket.key
                }
              ]
            }
          }));
      });
  }

/**
* Convinent wrapper to generate the stat resolvers.
* Given a string (field name) then generate a query and map the result
* @param {String} field 
*/
const getStats = (field) =>
  (parent, args, { dataSources }) => {
    // generate the occurrence search facet query, by inherting from the parent query, and map limit/offset to facet equivalents
    const query = {
      predicate: parent._query,
      size: 0,
      metrics: {
        stats: {
          type: 'stats',
          key: field
        }
      }
    };
    // query the API, and throw away anything but the facet counts
    return dataSources.occurrenceAPI.searchOccurrences({ query })
      .then(data => data.aggregations.stats);
  }

module.exports = {
  getFacet,
  getStats
}
