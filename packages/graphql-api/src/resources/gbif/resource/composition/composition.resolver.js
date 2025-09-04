import { excerpt, getHtml, isNoneEmptyArray } from '#/helpers/utils';
import logger from '#/logger';
import {
  KNOWN_BLOCK_TYPES,
  KNOWN_CAROUSEL_BLOCKS,
  KNOWN_FEATURE_TYPES,
} from './acceptedTypes';

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
  Query: {
    composition: (_, { id }, { dataSources, locale, preview }, info) =>
      dataSources.resourceAPI.getEntryById({ id, preview, locale, info }),
  },
  Composition: {
    title: (src, _, { locale }) =>
      getHtml(src.title, {
        inline: true,
        locale,
        allowedTags: ['em', 'i', 'strong', 'br'],
      }),
    summary: (src, _, { locale }) => getHtml(src.summary, { locale }),
    excerpt: (src, _, { locale }) => excerpt(src, { locale }),
    blocks: ({ blocks }, _, { dataSources, locale, preview }, info) => {
      if (!isNoneEmptyArray(blocks)) return null;

      const ids = blocks.map((block) => block.id);
      // get all and subsequently filter out the ones that are not allowed (not in include list : HeaderBlock | FeatureBlock | FeaturedTextBlock | CarouselBlock | MediaBlock | MediaCountBlock | CustomComponentBlock)
      return Promise.all(
        ids.map((id) =>
          dataSources.resourceAPI.getEntryById({ id, preview, locale, info }),
        ),
      ).then((results) =>
        results.filter((result) => {
          const knownType = KNOWN_BLOCK_TYPES[result.contentType];
          if (!knownType)
            logger.warn(
              `Unknown content type for a block in programme.resolver.js: ${result.contentType}`,
            );
          return knownType;
        }),
      );
    },
  },
  BlockItem: {
    __resolveType: (src) => {
      const graphqlType = KNOWN_BLOCK_TYPES[src.contentType];
      if (graphqlType) return graphqlType;
      console.warn(
        `Unknown content type in resourceSearch.resolver.js: ${src.contentType}`,
      );
    },
  },
  FeatureBlock: {
    features: ({ features }, args, { dataSources, locale, preview }, info) => {
      if (!isNoneEmptyArray(features)) return null;

      const ids = features.map((feature) => feature.id);
      return Promise.all(
        ids.map((id) =>
          dataSources.resourceAPI.getEntryById({ id, preview, locale, info }),
        ),
      ).then((results) =>
        results.filter((result) => {
          const knownType = KNOWN_FEATURE_TYPES[result.contentType];
          if (!knownType)
            logger.warn(
              `Unknown content type for a feature block in programme.resolver.js: ${result.contentType}`,
            );
          return knownType;
        }),
      );
    },
    title: (src, _, { locale }) =>
      getHtml(src.title, {
        inline: true,
        locale,
        allowedTags: ['em', 'i', 'strong', 'br'],
      }),
    body: (src, _, { locale }) =>
      getHtml(src.body, { trustLevel: 'trusted', wrapTables: true, locale }),
  },
  FeatureItem: {
    __resolveType: (src) => {
      const graphqlType = KNOWN_FEATURE_TYPES[src.contentType];
      if (graphqlType) return graphqlType;
      console.warn(
        `Unknown content type in resourceSearch.resolver.js: ${src.contentType}`,
      );
    },
  },
  CarouselBlock: {
    title: (src, _, { locale }) =>
      getHtml(src.title, {
        inline: true,
        locale,
        allowedTags: ['em', 'i', 'strong', 'br'],
      }),
    body: (src, _, { locale }) =>
      getHtml(src.body, { trustLevel: 'trusted', wrapTables: true, locale }),
    features: ({ features }, _, { dataSources, locale, preview }, info) => {
      if (!isNoneEmptyArray(features)) return null;

      const ids = features.map((feature) => feature.id);
      return Promise.all(
        ids.map((id) =>
          dataSources.resourceAPI.getEntryById({ id, preview, locale, info }),
        ),
      ).then((results) =>
        results.filter((result) => {
          const knownType = KNOWN_CAROUSEL_BLOCKS[result.contentType];
          if (!knownType)
            logger.warn(
              `Unknown content type for a caoursel block in programme.resolver.js: ${result.contentType}`,
            );
          return knownType;
        }),
      );
    },
  },
  CarouselBlockFeature: {
    __resolveType: (src) => {
      const graphqlType = KNOWN_CAROUSEL_BLOCKS[src.contentType];
      if (graphqlType) return graphqlType;
      console.warn(
        `Unknown content type in resourceSearch.resolver.js: ${src.contentType}`,
      );
    },
  },
  HeaderBlock: {
    title: (src, _, { locale }) => {
      return getHtml(src.title, {
        inline: true,
        locale,
        allowedTags: ['em', 'i', 'strong', 'br'],
      });
    },
    summary: (src, _, { locale }) => {
      return getHtml(src.summary, {
        locale,
        allowedTags: ['em', 'i', 'strong', 'br'],
      });
    },
  },
  TextBlock: {
    title: (src, _, { locale }) =>
      getHtml(src.title, {
        inline: true,
        locale,
        allowedTags: ['em', 'i', 'strong', 'br'],
      }),
    body: (src, _, { locale }) =>
      getHtml(src.body, { trustLevel: 'trusted', wrapTables: true, locale }),
  },
  FeaturedTextBlock: {
    title: (src, _, { locale }) =>
      getHtml(src.title, {
        inline: true,
        locale,
        allowedTags: ['em', 'i', 'strong', 'br'],
      }),
    body: (src, _, { locale }) =>
      getHtml(src.body, { trustLevel: 'trusted', wrapTables: true, locale }),
  },
  MediaBlock: {
    title: (src, _, { locale }) =>
      getHtml(src.title, {
        inline: true,
        locale,
        allowedTags: ['em', 'i', 'strong', 'br'],
      }),
    subtitle: (src, _, { locale }) =>
      getHtml(src.subtitle, { inline: true, locale }),
    body: (src, _, { locale }) =>
      getHtml(src.body, { trustLevel: 'trusted', wrapTables: true, locale }),
  },
  MediaCountBlock: {
    title: (src, _, { locale }) =>
      getHtml(src.title, {
        inline: true,
        locale,
        allowedTags: ['em', 'i', 'strong', 'br'],
      }),
    subtitle: (src, _, { locale }) =>
      getHtml(src.subtitle, { inline: true, locale }),
    body: (src, _, { locale }) =>
      getHtml(src.body, { trustLevel: 'trusted', wrapTables: true, locale }),
  },
  CustomComponentBlock: {
    title: (src, _, { locale }) =>
      getHtml(src.title, {
        inline: true,
        locale,
        allowedTags: ['em', 'i', 'strong', 'br'],
      }),
  },
};
