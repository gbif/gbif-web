import { getExcerpt, getOGImage } from '#/helpers/utils';
import { getCardinality, getFacet } from '../getQueryMetrics';
import { getThumborUrl } from '../resource/misc/misc.resolver';

const getSourceSearch = (dataSources) => (args) =>
  dataSources.institutionAPI.searchInstitutions.call(
    dataSources.institutionAPI,
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
    institutionSearch: (
      parent,
      { query = {}, ...args } = {},
      { dataSources },
    ) =>
      dataSources.institutionAPI.searchInstitutions({
        query: { ...args, ...query },
      }),
    institution: (parent, { key }, { dataSources }) =>
      dataSources.institutionAPI.getInstitutionByKey({ key }),
  },
  InstitutionSearchResults: {
    // this looks odd. I'm not sure what is the best way, but I want to transfer the current query to the child, so that it can be used when asking for the individual facets
    facet: (parent) => ({
      _query: { ...parent._query, limit: undefined, offset: undefined },
    }),
    cardinality: (parent) => ({
      _query: { ...parent._query, limit: undefined, offset: undefined },
    }),
  },
  Institution: {
    excerpt: ({ description }) => {
      if (typeof description === 'undefined') return null;
      return getExcerpt({
        strings: [description],
        length: 200,
      }).plainText;
    },
    collections: ({ key }, { limit, offset, query = {} }, { dataSources }) => {
      const { institutionKey: _key, ...rest } = query;

      return dataSources.collectionAPI
        .getCollectionsByInstitutionKey({
          key,
          limit,
          offset,
          ...rest,
        })
        .then((data) => data.results);
    },
    collectionCount: ({ key }, { query = {} }, { dataSources }) => {
      const {
        limit: _limit,
        institutionKey: _key,
        offset: _offset,
        ...rest
      } = query;
      return dataSources.collectionAPI
        .getCollectionsByInstitutionKey({ ...rest, key, limit: 0 })
        .then((data) => data.count);
    },
    replacedByInstitution: ({ replacedBy }, args, { dataSources }) => {
      if (!replacedBy) return null;
      return dataSources.institutionAPI.getInstitutionByKey({
        key: replacedBy,
      });
    },
    replacedByCollection: (
      { convertedToCollection },
      args,
      { dataSources },
    ) => {
      if (!convertedToCollection) return null;
      return dataSources.collectionAPI.getCollectionByKey({
        key: convertedToCollection,
      });
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
  },
  InstitutionSearchEntity: {
    thumbor: ({ featuredImageUrl: url }, { fitIn, width = '', height = '' }) =>
      getThumborUrl({ url, fitIn, width, height }),
    excerpt: ({ description }) => {
      if (typeof description === 'undefined') return null;
      return getExcerpt({
        strings: [description],
        length: 200,
      }).plainText;
    },
    collectionCount: ({ key }, { query = {} }, { dataSources }) => {
      const {
        limit: _limit,
        institutionKey: _key,
        offset: _offset,
        ...rest
      } = query;
      return dataSources.collectionAPI
        .getCollectionsByInstitutionKey({ ...rest, key, limit: 0 })
        .then((data) => data.count);
    },
  },
  InstitutionFacet: {
    country: getFacet('COUNTRY', getSourceSearch),
    city: getFacet('CITY', getSourceSearch),
    type: getFacet('TYPE', getSourceSearch),
    discipline: getFacet('DISCIPLINE', getSourceSearch),
  },
  InstitutionCardinality: {
    country: getCardinality('COUNTRY', getSourceSearch),
    city: getCardinality('CITY', getSourceSearch),
    type: getCardinality('TYPE', getSourceSearch),
    discipline: getCardinality('DISCIPLINE', getSourceSearch),
  },
};
