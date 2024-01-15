import { getHtml, excerpt, trustedTags, createLocalizedGbifHref } from "#/helpers/utils";

function isNoneEmptyArray(source) {
  return source != null && Array.isArray(source) && source.length > 0;
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
    // call: (src, _, context) => context.dataSources.getEntryById(src.call.id, false, context.locale),
    // gbifHref: (src, _, context) => createLocalizedGbifHref(context.locale, 'project', src.id),
  }
}