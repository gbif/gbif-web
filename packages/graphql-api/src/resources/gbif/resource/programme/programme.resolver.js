import { excerpt, getHtml, isNoneEmptyArray } from '#/helpers/utils';
import logger from '#/logger';
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
    programme: (_, { id }, { dataSources, locale, preview }, info) =>
      dataSources.resourceAPI.getEntryById({
        id,
        preview,
        locale,
        info,
      }),
  },
  Programme: {
    title: (src, _, { locale }) =>
      getHtml(src.title, {
        inline: true,
        locale,
        allowedTags: ['em', 'i', 'strong'],
      }),
    body: (src, _, { locale }) =>
      getHtml(src.body, { trustLevel: 'trusted', wrapTables: true, locale }),
    summary: (src, _, { locale }) => getHtml(src.summary, { locale }),
    excerpt: (src, _, { locale }) => excerpt(src, { locale }),
    events: (src, _, { dataSources, locale, preview }, info) => {
      if (!isNoneEmptyArray(src.events)) return null;

      const ids = src.events.map((event) => event.id);
      return Promise.all(
        ids.map((id) =>
          dataSources.resourceAPI.getEntryById({ id, preview, locale, info }),
        ),
      );
    },
    news: (src, _, { dataSources, locale, preview }, info) => {
      if (!isNoneEmptyArray(src.news)) return null;

      const ids = src.news.map((news) => news.id);
      return Promise.all(
        ids.map((id) =>
          dataSources.resourceAPI.getEntryById({ id, preview, locale, info }),
        ),
      );
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
    fundingOrganisations: (src, _, { dataSources, locale, preview }, info) => {
      if (!isNoneEmptyArray(src.fundingOrganisations)) return null;

      const ids = src.fundingOrganisations.map((partner) => partner.id);
      return Promise.all(
        ids.map((id) =>
          dataSources.resourceAPI.getEntryById({ id, preview, locale, info }),
        ),
      );
    },
    // call: (src, _, context) => context.dataSources.getEntryById(src.call.id, false, context.locale),
    // gbifHref: (src, _, { locale }) => createLocalizedGbifHref(locale, 'project', src.id),
  },
};
