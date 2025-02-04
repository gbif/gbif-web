const getTranslatedValue = (
  { name, label = [] },
  { language = 'en' },
  { dataSources },
) => {
  // transform label array to map using language as key
  const labelMap = label.reduce((acc, cur) => {
    acc[cur.language] = cur.value;
    return acc;
  }, {});
  return labelMap[language] || labelMap['en'] || name;
};

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
  Query: {
    gadm: (parent, { id }, { dataSources }) =>
      dataSources.gadmAPI.getGadmById({ id }),
  },
};
