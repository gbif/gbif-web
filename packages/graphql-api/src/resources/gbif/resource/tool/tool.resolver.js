import { createLocalizedGbifHref, excerpt, getHtml } from '#/helpers/utils';

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
  Query: {
    tool: (_, { id }, { dataSources, locale, preview }, info) =>
      dataSources.resourceAPI.getEntryById({ id, preview, locale, info }),
  },
  Tool: {
    title: (src, _, { locale }) =>
      getHtml(src.title, {
        inline: true,
        locale,
        allowedTags: ['em', 'i', 'strong'],
      }),
    summary: (src, _, { locale }) => getHtml(src.summary, { locale }),
    body: (src, _, { locale }) =>
      getHtml(src.body, { trustLevel: 'trusted', wrapTables: true, locale }),
    excerpt: (src, _, { locale }) => excerpt(src, { locale }),
    gbifHref: (src, _, { locale }) =>
      createLocalizedGbifHref(locale, 'tool', src.id),
    rightsHolder: (src, _, { locale }) => getHtml(src.rightsHolder, { locale }),
    rights: (src, _, { locale }) => getHtml(src.rights, { locale }),
    author: (src, _, { locale }) => getHtml(src.author, { locale }),
    citation: (src, _, { locale }) => getHtml(src.citation, { locale }),
  },
};
