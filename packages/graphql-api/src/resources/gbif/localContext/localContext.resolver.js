/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
const localeMap = {
  fra: 'fr',
  eng: 'en',
  spa: 'es',
};

export default {
  LocalContextNotice: {
    name: (notice, { lang }) => {
      const translations = notice?.translations ?? [];
      const translatedText = translations.find(
        (t) => t && t.language_tag === localeMap[lang],
      )?.translated_name;
      return translatedText ?? notice.name;
    },
    default_text: (notice, { lang }) => {
      const translations = notice?.translations ?? [];
      const translatedText = translations.find(
        (t) => t.language_tag === localeMap[lang],
      )?.translated_text;
      return translatedText ?? notice.default_text;
    },
  },
};
