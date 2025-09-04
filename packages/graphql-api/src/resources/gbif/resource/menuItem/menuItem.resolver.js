/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
  MenuItem: {
    children: ({ id }, _, { dataSources, locale, preview }, info) => {
      // get the current element by ID
      return dataSources.resourceAPI
        .getEntryById({ id, locale, preview, info })
        .then(({ childNavigationElements }) => {
          if (!childNavigationElements) return null;
          // and for each of the children, get the full element
          return childNavigationElements.map(async (child) => {
            const children = await dataSources.resourceAPI.getEntryById({
              id: child.id,
              locale,
              preview,
              info,
            });
            return children;
          });
        });
    },
  },
};
