import _ from 'lodash';
import { getExcerpt, getOGImage } from '#/helpers/utils';
import { getThumborUrl } from '../resource/misc/misc.resolver';

function between(input, min, max) {
  return Math.min(Math.max(input, min), max);
}

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
  Query: {
    collectionSearch: (parent, { query = {}, ...args } = {}, { dataSources }) =>
      dataSources.collectionAPI.searchCollections({ query: { ...args, ...query } }),
    collection: (parent, { key }, { dataSources }) =>
      dataSources.collectionAPI.getCollectionByKey({ key }),
    collectionDescriptorGroup: (parent, { key, collectionKey }, { dataSources }) =>
      dataSources.collectionAPI.getCollectionDescriptorGroup({ key, collectionKey }),
  },
  CollectionSearchEntity: {
    thumbor: ({ featuredImageUrl: url }, { fitIn, width = '', height = '' }) => getThumborUrl({url, fitIn, width, height}),
    excerpt: ({ description, taxonomicCoverage, geography }) => {
      if (typeof description === 'undefined') return null;
      return getExcerpt({
        strings: [description, taxonomicCoverage, geography],
        length: 300,
      }).plainText;
    },
  },
  Collection: {
    institution: ({ institutionKey: key }, args, { dataSources }) => {
      if (typeof key === 'undefined') return null;
      return dataSources.institutionAPI.getInstitutionByKey({ key });
    },
    descriptorGroups: ({ key }, {limit: limit = 20, offset: offset = 0}, { dataSources }) => {
      return dataSources.collectionAPI.searchCollectionDescriptorGroups({ key, limit, offset });
    },
    // This would fetch the updated number, but we have since added a batch job to update counts. Which is likely good enough
    // occurrenceCount: ({ key }, args, { dataSources }) => {
    //   if (typeof key === 'undefined') return null;
    //   return dataSources.occurrenceAPI
    //     .searchOccurrenceDocuments({
    //       query: {
    //         predicate: { type: 'equals', key: 'collectionKey', value: key },
    //       },
    //     })
    //     .then((response) => response.total);
    // },
    replacedByCollection: ({ replacedBy }, args, { dataSources }) => {
      if (!replacedBy) return null;
      return dataSources.collectionAPI.getCollectionByKey({ key: replacedBy });
    },
    thumbor: ({ featuredImageUrl: url }, { fitIn, width = '', height = '' }) => getThumborUrl({url, fitIn, width, height}),
    homepageOGImageUrl_volatile: ({ homepage }) => {
      return getOGImage({ homepage }).then((response) => {
        return response;
      }).catch(() => null);
    },
    excerpt: ({ description, taxonomicCoverage, geography }) => {
      if (typeof description === 'undefined') return null;
      return getExcerpt({
        strings: [description, taxonomicCoverage, geography],
        length: 300,
      }).plainText;
    },
    richness: (collection) => {
      let completeness = 0;
      let totalAvailable = 0;
      const fields = [
        'taxonomicCoverage',
        'geography',
        'address.country',
        'address.address',
        'code',
        'email',
        'homepage',
        { field: 'numberSpecimens', counts: 2 },
      ];
      // each field gives you point per default. But con be configured to be more than 1 for a field
      fields.forEach((x) => {
        let conf = {
          field: x,
          counts: 1,
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
      const descPoints = between(
        Math.ceil(description.length / 200),
        0,
        maxDescPoint,
      );
      completeness += descPoints;
      totalAvailable += maxDescPoint;

      // returns as a percentage rounded up
      return Math.ceil((100 * completeness) / totalAvailable);
    },
  },
  CollectionDescriptorGroup: {
    descriptors: ({ collectionKey, key }, { limit = 20, offset = 0 }, { dataSources }) => {
      return dataSources.collectionAPI.getCollectionDescriptor({ key, collectionKey, limit, offset });
    },
  }
};
