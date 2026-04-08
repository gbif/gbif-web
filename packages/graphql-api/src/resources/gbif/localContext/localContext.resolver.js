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
  // Be very defensive as we have no control over API changes. Fail silently
  LocalContext: {
    labels: (localContext) => {
      const bcLabels = localContext?.bc_labels ?? [];
      const tkLabels = localContext?.tk_labels ?? [];
      return [...bcLabels, ...tkLabels];
    },
  },
  LocalContextNotice: {
    name: (notice, { lang }) => {
      const translations = notice?.translations ?? [];
      const translatedText = translations.find(
        (t) => t && t.language_tag === localeMap[lang],
      )?.translated_name;
      return translatedText ?? notice?.name ?? 'No name provided';
    },
    default_text: (notice, { lang }) => {
      const translations = notice?.translations ?? [];
      const translatedText = translations.find(
        (t) => t.language_tag === localeMap[lang],
      )?.translated_text;
      return translatedText ?? notice?.default_text;
    },
  },
  LocalContextLabel: {
    communityName: (label) => {
      return label?.community?.name ?? null;
    },
    name: (label, { lang }) => {
      const translations = label?.translations ?? [];
      const translatedText = translations.find(
        (t) => t && t.language_tag === localeMap[lang],
      )?.translated_name;
      return translatedText ?? label?.name ?? 'No name provided';
    },
    label_text: (label, { lang }) => {
      const translations = label?.translations ?? [];
      const translatedText = translations.find(
        (t) => t.language_tag === localeMap[lang],
      )?.translated_text;
      return translatedText ?? label?.label_text;
    },
  },
};
