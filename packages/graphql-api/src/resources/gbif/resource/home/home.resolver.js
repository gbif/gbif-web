import { getHtml, excerpt, trustedTags, createLocalizedGbifHref } from "#/helpers/utils";

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
  Query: {
    gbifHome: (_, { preview }, { dataSources, locale }) =>
      dataSources.resourceAPI.getEntryById({ id: '3D1QT0b4vuKS4iGaaumqwG', preview, locale })
  },
  Home: {
    children: ({mainNavigationElements}, _, { dataSources, locale }) => {
      if (!mainNavigationElements) return [];
      return mainNavigationElements.map(child => {
        return dataSources.resourceAPI.getEntryById({ id: child.id, locale })
      })
    }
  }
}