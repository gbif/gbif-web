import { isNoneEmptyArray } from '#/helpers/utils';
import { KNOWN_BLOCK_TYPES } from '../composition/acceptedTypes';

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
  Query: {
    gbifHome: (_, __, { dataSources, locale, preview }, info) =>
      dataSources.resourceAPI.getEntryById({
        id: '3D1QT0b4vuKS4iGaaumqwG',
        preview,
        locale,
        info,
      }),
  },
  Home: {
    children: (
      { mainNavigationElements },
      _,
      { dataSources, locale, preview },
      info,
    ) => {
      if (!mainNavigationElements) return [];
      return mainNavigationElements.map((child) => {
        return dataSources.resourceAPI.getEntryById({
          id: child.id,
          locale,
          preview,
          info,
        });
      });
    },
    blocks: ({ blocks }, args, { dataSources, locale, preview }, info) => {
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
};
