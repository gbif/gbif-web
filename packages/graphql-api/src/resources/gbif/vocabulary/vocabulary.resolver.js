export const getTranslatedVocabConceptValue =
  (field, { useNameAsFallback } = {}) =>
  (item, { language = 'en' }) => {
    // transform label array to map using language as key
    const label = item[field];
    const labelMap = label.reduce((acc, cur) => {
      acc[cur.language] = cur.value;
      return acc;
    }, {});
    return (
      labelMap[language] ||
      labelMap.en ||
      (useNameAsFallback ? item.name : null)
    );
  };

// GeoTime concepts carry their structured metadata as "key: value" tag
// strings (e.g. "rank: Age", "startAge: 259.51"). Pull a single value out
// of that list by key.
const getTagValue = (tags, key) => {
  if (!Array.isArray(tags)) return null;
  const prefix = `${key}:`;
  const match = tags.find(
    (tag) => typeof tag?.name === 'string' && tag.name.startsWith(prefix),
  );
  if (!match) return null;
  const value = match.name.slice(prefix.length).trim();
  return value.length ? value : null;
};

const getTagFloat = (tags, key) => {
  const raw = getTagValue(tags, key);
  if (raw == null) return null;
  const num = Number(raw);
  return Number.isFinite(num) ? num : null;
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
    // vocabularySearch: (parent, query, { dataSources }) =>
    //   dataSources.vocabularyAPI.searchVocabularies({ query }),
    vocabulary: (parent, { key }, { dataSources }) =>
      dataSources.vocabularyAPI.getVocabulary({ key }),
    vocabularyConceptSearch: (
      parent,
      { vocabulary, ...query },
      { dataSources },
    ) => dataSources.vocabularyAPI.searchConcepts({ vocabulary, query }),
    vocabularyConcept: (parent, { vocabulary, concept }, { dataSources }) =>
      dataSources.vocabularyAPI.getConcept({ vocabulary, concept }),
    geoTimeConceptSearch: (parent, query, { dataSources }) =>
      dataSources.vocabularyAPI.searchConcepts({
        vocabulary: 'GeoTime',
        query,
      }),
  },
  Vocabulary: {
    concepts: ({ name }, args, { dataSources }) => {
      return dataSources.vocabularyAPI.searchConcepts({
        vocabulary: name,
        query: args,
      });
    },
    uiLabel: getTranslatedVocabConceptValue('label', {
      useNameAsFallback: true,
    }),
    uiDefinition: getTranslatedVocabConceptValue('definition'),
  },
  VocabularyConcept: {
    uiLabel: getTranslatedVocabConceptValue('label', {
      useNameAsFallback: true,
    }),
    uiDefinition: getTranslatedVocabConceptValue('definition'),
    parents: ({ vocabularyName, parents }, args, { dataSources }) => {
      if (!vocabularyName || !parents) return null;

      // for all parents in the array, we need to fetch the concept value using dataSources.vocabularyAPI.getConcept({vocabulary, concept});
      return parents.map((parent) => {
        return dataSources.vocabularyAPI.getConcept({
          vocabulary: vocabularyName,
          concept: parent,
        });
      });
    },
  },
  GeoTimeConcept: {
    uiLabel: getTranslatedVocabConceptValue('label', {
      useNameAsFallback: true,
    }),
    uiDefinition: getTranslatedVocabConceptValue('definition'),
    parents: ({ vocabularyName, parents }, args, { dataSources }) => {
      if (!vocabularyName || !parents) return null;
      return parents.map((parent) =>
        dataSources.vocabularyAPI.getConcept({
          vocabulary: vocabularyName,
          concept: parent,
        }),
      );
    },
    rank: ({ tags }) => getTagValue(tags, 'rank'),
    startAge: ({ tags }) => getTagFloat(tags, 'startAge'),
    endAge: ({ tags }) => getTagFloat(tags, 'endAge'),
  },
};
