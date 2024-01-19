import { getHtml, isNoneEmptyArray, trustedTags } from "#/helpers/utils";
import { KNOWN_BLOCK_TYPES, KNOWN_CAROUSEL_BLOCKS, KNOWN_FEATURE_TYPES } from "./acceptedTypes";

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
  Query: {
    composition: (_, { id, preview }, context) => {
      const { dataSources, locale } = context;
      context.preview = context.preview ?? preview;
      return dataSources.resourceAPI.getEntryById({ id, preview: context.preview, locale })
    }
  },
  Composition: {
    title: src => getHtml(src.title, { inline: true }),
    summary: src => getHtml(src.summary),
  },
  BlockItem: {
    __resolveType: src => {
      const graphqlType = KNOWN_BLOCK_TYPES[src.contentType];
      if (graphqlType) return graphqlType;
      console.warn(`Unknown content type in resourceSearch.resolver.js: ${src.contentType}`);
    },
  },
  FeatureBlock: {
    features: ({ features }, args, { dataSources, locale, preview }) => {
      if (!isNoneEmptyArray(features)) return null;

      const ids = features.map(feature => feature.id);
      return Promise.all(ids.map(id => dataSources.resourceAPI.getEntryById({ id, preview, locale })))
        .then(results => results.filter(result => {
          const knownType = KNOWN_FEATURE_TYPES[result.contentType];
          if (!knownType) logger.warn(`Unknown content type for a feature block in programme.resolver.js: ${result.contentType}`);
          return knownType;
        }));
    },
    title: src => getHtml(src.title, { inline: true }),
    body: src => getHtml(src.body, {allowedTags: trustedTags, wrapTables: true}),
  },
  FeatureItem: {
    __resolveType: src => {
      const graphqlType = KNOWN_FEATURE_TYPES[src.contentType];
      if (graphqlType) return graphqlType;
      console.warn(`Unknown content type in resourceSearch.resolver.js: ${src.contentType}`);
    },
  },
  CarouselBlock: {
    title: src => getHtml(src.title, { inline: true }),
    body: src => getHtml(src.body, {allowedTags: trustedTags, wrapTables: true}),
    features: ({ features }, args, { dataSources, locale, preview }) => {
      if (!isNoneEmptyArray(features)) return null;

      const ids = features.map(feature => feature.id);
      return Promise.all(ids.map(id => dataSources.resourceAPI.getEntryById({ id, preview, locale })))
        .then(results => results.filter(result => {
          const knownType = KNOWN_CAROUSEL_BLOCKS[result.contentType];
          if (!knownType) logger.warn(`Unknown content type for a caoursel block in programme.resolver.js: ${result.contentType}`);
          return knownType;
        }));
    }
  },
  CarouselBlockFeature: {
    __resolveType: src => {
      const graphqlType = KNOWN_CAROUSEL_BLOCKS[src.contentType];
      if (graphqlType) return graphqlType;
      console.warn(`Unknown content type in resourceSearch.resolver.js: ${src.contentType}`);
    },
  },
  HeaderBlock: {
    title: src => getHtml(src.title, { inline: true }),
    summary: src => getHtml(src.summary),
  },
  TextBlock: {
    title: src => getHtml(src.title, { inline: true }),
    body: src => getHtml(src.body, {allowedTags: trustedTags, wrapTables: true}),
  },
  FeaturedTextBlock: {
    title: src => getHtml(src.title, { inline: true }),
    body: src => getHtml(src.body, {allowedTags: trustedTags, wrapTables: true}),
  },
  MediaBlock: {
    title: src => getHtml(src.title, { inline: true }),
    subtitle: src => getHtml(src.subtitle, { inline: true }),
    body: src => getHtml(src.body, {allowedTags: trustedTags, wrapTables: true}),
  },
  MediaCountBlock: {
    title: src => getHtml(src.title, { inline: true }),
    subtitle: src => getHtml(src.subtitle, { inline: true }),
    body: src => getHtml(src.body, {allowedTags: trustedTags, wrapTables: true}),
  },
  CustomComponentBlock: {
    title: src => getHtml(src.title, { inline: true }),
  }
}