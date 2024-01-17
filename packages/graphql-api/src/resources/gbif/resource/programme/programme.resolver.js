import { getHtml, excerpt, trustedTags, createLocalizedGbifHref, isNoneEmptyArray } from "#/helpers/utils";
import logger from "#/logger";
import { KNOWN_BLOCK_TYPES } from "../composition/acceptedTypes";

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
  Query: {
    programme: (_, { id, preview }, { dataSources, locale }) =>
      dataSources.resourceAPI.getEntryById({ id, preview, locale })
  },
  Programme: {
    title: src => getHtml(src.title, { inline: true, allowedTags: ['em', 'i'] }),
    body: src => getHtml(src.body, {allowedTags: trustedTags, wrapTables: true}),
    summary: src => getHtml(src.summary),
    excerpt: src => excerpt(src),
    events: (src, _, { dataSources, locale }) => {
      if (!isNoneEmptyArray(src.events)) return null;

      const ids = src.events.map(event => event.id);
      return Promise.all(ids.map(id => dataSources.resourceAPI.getEntryById({ id, preview: false, locale })));
    },
    news: (src, _, { dataSources, locale }) => {
      if (!isNoneEmptyArray(src.news)) return null;

      const ids = src.news.map(news => news.id);
      return Promise.all(ids.map(id => dataSources.resourceAPI.getEntryById({ id, preview: false, locale })));
    },
    blocks: ({blocks}, args, { dataSources, locale, preview }) => {
      if (!isNoneEmptyArray(blocks)) return null;

      const ids = blocks.map(block => block.id);
      // get all and subsequently filter out the ones that are not allowed (not in include list : HeaderBlock | FeatureBlock | FeaturedTextBlock | CarouselBlock | MediaBlock | MediaCountBlock | CustomComponentBlock)
      return Promise.all(ids.map(id => dataSources.resourceAPI.getEntryById({ id, preview, locale })))
      .then(results => results.filter(result => {
        const knownType = KNOWN_BLOCK_TYPES[result.contentType];
        if (!knownType) logger.warn(`Unknown content type for a block in programme.resolver.js: ${result.contentType}`);
        return knownType;
      }));
    }
    // call: (src, _, context) => context.dataSources.getEntryById(src.call.id, false, context.locale),
    // gbifHref: (src, _, context) => createLocalizedGbifHref(context.locale, 'project', src.id),
  }
}