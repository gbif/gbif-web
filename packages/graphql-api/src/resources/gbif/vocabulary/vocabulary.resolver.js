const getTranslatedValue = (field, { useNameAsFallback } = {}) => (item, { language = 'en' }, { dataSources }) => {
  // transform label array to map using language as key
  const label = item[field];
  const labelMap = label.reduce((acc, cur) => {
    acc[cur.language] = cur.value;
    return acc;
  }
    , {});
  return labelMap[language] || labelMap['en'] || (useNameAsFallback ? item.name : null);
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
    // vocabularySearch: (parent, query, { dataSources }) =>
    //   dataSources.vocabularyAPI.searchVocabularies({ query }),
    vocabulary: (parent, { key }, { dataSources }) =>
      dataSources.vocabularyAPI.getVocabulary({ key }),
    vocabularyConceptSearch: (parent, { vocabulary, ...query }, { dataSources }) =>
      dataSources.vocabularyAPI.searchConcepts({ vocabulary, query }),
    vocabularyConcept: (parent, { vocabulary, concept }, { dataSources }) =>
      dataSources.vocabularyAPI.getConcept({ vocabulary, concept }),
  },
  Vocabulary: {
    concepts: ({ name }, args, { dataSources }) => {
      return dataSources.vocabularyAPI.searchConcepts({
        vocabulary: name,
        query: args,
      });
    },
    uiLabel: getTranslatedValue('label', { useNameAsFallback: true }),
    uiDefinition: getTranslatedValue('definition'),
  },
  VocabularyConcept: {
    uiLabel: getTranslatedValue('label', { useNameAsFallback: true }),
    uiDefinition: getTranslatedValue('definition'),
    parents: ({ vocabularyName, parents }, args, { dataSources }) => {
      if (!vocabularyName || !parents) return null;

      // for all parents in the array, we need to fetch the concept value using dataSources.vocabularyAPI.getConcept({vocabulary, concept});
      return parents.map(parent => {
        return dataSources.vocabularyAPI.getConcept({ vocabulary: vocabularyName, concept: parent });
      });
    }
  },
};
