import { excerpt } from '#/helpers/utils';
import {
  getFacet,
  getStats,
  getCardinality,
  getHistogram,
  getAutoDateHistogram,
} from '../getMetrics';
import {
  facetFields,
  statsFields,
  cardinalityFields,
  histogramFields,
  dateHistogramFields,
} from './helpers/fields';

const getSourceSearch = (dataSources) => (args) =>
  dataSources.literatureAPI.searchLiterature.call(
    dataSources.literatureAPI,
    args,
  );

// there are many fields that support facets. This function creates the resolvers for all of them
const facetReducer = (dictionary, facetName) => {
  dictionary[facetName] = getFacet(facetName, getSourceSearch);
  return dictionary;
};
const LiteratureFacet = facetFields.reduce(facetReducer, {});

// there are also many fields that support cardinality. Generate them all.
const cardinalityReducer = (dictionary, fieldName) => {
  dictionary[fieldName] = getCardinality(fieldName, getSourceSearch);
  return dictionary;
};
const LiteratureCardinality = cardinalityFields.reduce(cardinalityReducer, {});

// there are also many fields that support histograms. Generate them all.
const histogramReducer = (dictionary, fieldName) => {
  dictionary[fieldName] = getHistogram(fieldName, getSourceSearch);
  return dictionary;
};
const LiteratureHistogram = histogramFields.reduce(histogramReducer, {});

// there are also many fields that support date histograms. Generate them all.
const autoDateHistogramReducer = (dictionary, fieldName) => {
  dictionary[fieldName] = getAutoDateHistogram(fieldName, getSourceSearch);
  return dictionary;
};
const LiteratureAutoDateHistogram = dateHistogramFields.reduce(
  autoDateHistogramReducer,
  {},
);

// there are also many fields that support stats. Generate them all.
const statsReducer = (dictionary, statsName) => {
  dictionary[statsName] = getStats(statsName, getSourceSearch);
  return dictionary;
};
const LiteratureStats = statsFields.reduce(statsReducer, {});

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
  Query: {
    literatureSearch: (parent, { predicate, ...params }) => {
      return {
        _predicate: predicate,
        _params: params,
      };
    },
    literature: (parent, { key }, { dataSources }) =>
      dataSources.literatureAPI.getLiteratureByKey({ key }),
  },
  LiteratureSearchResult: {
    documents: (parent, query, { dataSources }) => {
      return dataSources.literatureAPI.searchLiteratureDocuments({
        query: { predicate: parent._predicate, ...parent._params, ...query },
      });
    },
    facet: (parent) => {
      return { _predicate: parent._predicate };
    },
    stats: (parent) => {
      return { _predicate: parent._predicate };
    },
    cardinality: (parent) => {
      return { _predicate: parent._predicate };
    },
    histogram: (parent) => {
      return { _predicate: parent._predicate };
    },
    autoDateHistogram: (parent) => {
      return { _predicate: parent._predicate };
    },
    _meta: (parent, query, { dataSources }) => {
      return dataSources.literatureAPI.meta({
        query: { predicate: parent._predicate },
      });
    },
  },
  LiteratureFacet,
  LiteratureCardinality,
  LiteratureHistogram,
  LiteratureAutoDateHistogram,
  LiteratureStats,
  Literature: {
    // TODO: Remove (used to test that erros don't get cached)
    title: src => Math.random() > 0.5 ? src.title : null,
    excerpt: (src) => excerpt({ body: src.abstract }),
    // someField: ({ fieldWithKey: key }, args, { dataSources }) => {
    //   if (typeof key === 'undefined') return null;
    //   dataSources.someAPI.getSomethingByKey({ key })
    // },
  },
  OrganizationFacet: {
    organization: ({ key, name }, args, { dataSources }) => {
      const id = key ?? name;
      if (typeof id === 'undefined') return null;
      return dataSources.organizationAPI.getOrganizationByKey({
        key: id,
      });
    },
  },
  DatasetFacet: {
    dataset: ({ key, name }, args, { dataSources }) => {
      const id = key ?? name;
      if (typeof id === 'undefined') return null;
      return dataSources.datasetAPI.getDatasetByKey({
        key: id,
      });
    },
  },
};
