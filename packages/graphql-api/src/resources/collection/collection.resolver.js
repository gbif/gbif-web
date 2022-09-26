const { getExcerpt } = require('../../util/utils');
const _ = require('lodash');
/** 
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
*/
module.exports = {
  Query: {
    collectionSearch: (parent, args, { dataSources }) =>
      dataSources.collectionAPI.searchCollections({query: args}),
    collection: (parent, { key }, { dataSources }) =>
      dataSources.collectionAPI.getCollectionByKey({ key })
  },
  Collection: {
    institution: ({institutionKey: key}, args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.institutionAPI.getInstitutionByKey({key});
    },
    occurrenceCount: ({ key }, args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.occurrenceAPI
        .searchOccurrenceDocuments(
          { query: { predicate: { type: 'equals', key: 'collectionKey', value: key } } }
        )
        .then(response => response.total);
    },
    excerpt: ({description, taxonomicCoverage, geography}, args, { dataSources }) => {
      if (typeof description === 'undefined') return null;
      return getExcerpt({strings: [description, taxonomicCoverage, geography], length: 300}).plainText;
    },
    richness: (collection, args, { dataSources }) => {
      let completeness = 0;
      let totalAvailable = 0;
      let fields = ['taxonomicCoverage', 'geography', 'address.country', 'address.address', 'code', 'email', 'homepage', {field: 'numberSpecimens', counts: 2}];
      //each field gives you point per default. But con be configured to be more than 1 for a field
      fields.forEach(x => {
        let conf = {
          field: x,
          counts: 1
        };
        if (typeof x !== 'string') {
          conf = x;
        }
        totalAvailable += conf.counts;
        if (_.get(collection, conf.field)) completeness += conf.counts;
      });

      // descriptions can give up to x points depending on length
      const maxDescPoint = 2;
      const description = collection.description || '';
      const descPoints = between(Math.ceil(description.length / 200), 0, maxDescPoint);
      completeness += descPoints;
      totalAvailable += maxDescPoint;

      // returns as a percentage rounded up
      return Math.ceil(100 * completeness / totalAvailable);
    },
  }
};

function between(input, min, max) {
  return Math.min(Math.max(input, min), max);
}