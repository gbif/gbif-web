import _ from 'lodash';
import { getExcerpt, getOGImage } from '#/helpers/utils';
import { getCardinality, getFacet } from '../getQueryMetrics';
import { getThumborUrl } from '../resource/misc/misc.resolver';

function between(input, min, max) {
  return Math.min(Math.max(input, min), max);
}

const getSourceSearch = (dataSources) => (args) =>
  dataSources.collectionAPI.searchCollections.call(
    dataSources.collectionAPI,
    args,
  );

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
      dataSources.collectionAPI.searchCollections({
        query: { ...args, ...query },
      }),
    collection: (parent, { key }, { dataSources }) =>
      dataSources.collectionAPI.getCollectionByKey({ key }),
    collectionDescriptorGroup: (
      parent,
      { key, collectionKey },
      { dataSources },
    ) =>
      dataSources.collectionAPI.getCollectionDescriptorGroup({
        key,
        collectionKey,
      }),
  },
  CollectionSearchResults: {
    // this looks odd. I'm not sure what is the best way, but I want to transfer the current query to the child, so that it can be used when asking for the individual facets
    facet: (parent) => ({
      _query: { ...parent._query, limit: undefined, offset: undefined },
    }),
    cardinality: (parent) => ({
      _query: { ...parent._query, limit: undefined, offset: undefined },
    }),
  },
  CollectionSearchEntity: {
    thumbor: ({ featuredImageUrl: url }, { fitIn, width = '', height = '' }) =>
      getThumborUrl({ url, fitIn, width, height }),
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
    descriptorGroups: (
      { key },
      { limit = 20, offset = 0 },
      { dataSources },
    ) => {
      return dataSources.collectionAPI.searchCollectionDescriptorGroups({
        key,
        limit,
        offset,
      });
    },
    replacedByCollection: ({ replacedBy }, args, { dataSources }) => {
      if (!replacedBy) return null;
      return dataSources.collectionAPI.getCollectionByKey({ key: replacedBy });
    },
    thumbor: ({ featuredImageUrl: url }, { fitIn, width = '', height = '' }) =>
      getThumborUrl({ url, fitIn, width, height }),
    homepageOGImageUrl_volatile: (
      { featuredImageUrl, homepage },
      { onlyIfNoImageUrl, timeoutMs = 5000 },
    ) => {
      if (onlyIfNoImageUrl && featuredImageUrl) {
        return null;
      }
      return getOGImage({ homepage, timeoutMs })
        .then((response) => {
          return response;
        })
        .catch(() => null);
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
  DescriptorMatches: {
    taxon: ({ usageKey }, args, { dataSources }) => {
      if (typeof usageKey === 'undefined') return null;
      return dataSources.taxonAPI.getTaxonByKey({
        key: usageKey,
      });
    },
  },
  CollectionDescriptorGroup: {
    descriptors: (
      { collectionKey, key },
      { limit = 20, offset = 0 },
      { dataSources },
    ) => {
      return dataSources.collectionAPI.getCollectionDescriptor({
        key,
        collectionKey,
        limit,
        offset,
      });
    },
  },
  CollectionFacet: {
    institutionKey: getFacet('INSTITUTION_KEY', getSourceSearch),
    country: getFacet('COUNTRY', getSourceSearch),
    city: getFacet('CITY', getSourceSearch),
    kingdomKey: getFacet('KINGDOM_KEY', getSourceSearch),
    phylumKey: getFacet('PHYLUM_KEY', getSourceSearch),
    classKey: getFacet('CLASS_KEY', getSourceSearch),
    orderKey: getFacet('ORDER_KEY', getSourceSearch),
    familyKey: getFacet('FAMILY_KEY', getSourceSearch),
    genusKey: getFacet('GENUS_KEY', getSourceSearch),
    speciesKey: getFacet('SPECIES_KEY', getSourceSearch),
    recordedBy: getFacet('RECORDED_BY', getSourceSearch),
    descriptorCountry: getFacet('DESCRIPTOR_COUNTRY', getSourceSearch),
    contentType: getFacet('CONTENT_TYPE', getSourceSearch),
    preservationType: getFacet('PRESERVATION_TYPE', getSourceSearch),
    accessionStatus: getFacet('ACCESSION_STATUS', getSourceSearch),
    typeStatus: getFacet('TYPE_STATUS', getSourceSearch),
    biomeType: getFacet('BIOME_TYPE', getSourceSearch),
    objectClassification: getFacet('OBJECT_CLASSIFICATION', getSourceSearch),
  },
  CollectionCardinality: {
    institutionKey: getCardinality('INSTITUTION_KEY', getSourceSearch),
    country: getCardinality('COUNTRY', getSourceSearch),
    city: getCardinality('CITY', getSourceSearch),
    kingdomKey: getCardinality('KINGDOM_KEY', getSourceSearch),
    phylumKey: getCardinality('PHYLUM_KEY', getSourceSearch),
    classKey: getCardinality('CLASS_KEY', getSourceSearch),
    orderKey: getCardinality('ORDER_KEY', getSourceSearch),
    familyKey: getCardinality('FAMILY_KEY', getSourceSearch),
    genusKey: getCardinality('GENUS_KEY', getSourceSearch),
    speciesKey: getCardinality('SPECIES_KEY', getSourceSearch),
    recordedBy: getCardinality('RECORDED_BY', getSourceSearch),
    descriptorCountry: getCardinality('DESCRIPTOR_COUNTRY', getSourceSearch),
    contentType: getCardinality('CONTENT_TYPE', getSourceSearch),
    preservationType: getCardinality('PRESERVATION_TYPE', getSourceSearch),
    accessionStatus: getCardinality('ACCESSION_STATUS', getSourceSearch),
    typeStatus: getCardinality('TYPE_STATUS', getSourceSearch),
    biomeType: getCardinality('BIOME_TYPE', getSourceSearch),
    objectClassification: getCardinality(
      'OBJECT_CLASSIFICATION',
      getSourceSearch,
    ),
  },
};
