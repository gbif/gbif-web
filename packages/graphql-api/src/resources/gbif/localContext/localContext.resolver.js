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

function label2note(label) {
  return {
    ...label,
    pageUrl: label.label_page,
    description: label.label_text,
  };
}
export default {
  // Be very defensive as we have no control over API changes. Fail silently
  LocalContext: {
    labels: (localContext) => {
      const bcLabels = localContext?.bc_labels ?? [];
      const tkLabels = localContext?.tk_labels ?? [];
      return [...bcLabels, ...tkLabels];
    },
    notes: (localContext) => {
      const notes = [
        ...(localContext?.bc_labels ?? []).map(label2note),
        ...(localContext?.tk_labels ?? []).map(label2note),
        ...(localContext?.notice ?? []).map((notice) => ({
          ...notice,
          pageUrl: notice.notice_page,
          description: notice.default_text,
        })),
      ];
      return notes;
    },
    communityName: (localContext) => {
      // First, try to extract community from created_by array
      const createdBy = localContext?.created_by ?? [];
      const communityCreator = createdBy.find((creator) => creator?.community);
      if (communityCreator?.community?.name) {
        return communityCreator.community.name;
      }

      // If not found in created_by, check contributors.communities
      const contributorCommunities = localContext?.contributors?.communities ?? [];
      if (contributorCommunities.length > 0 && contributorCommunities[0]?.name) {
        return contributorCommunities[0].name;
      }

      return null;
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
  LocalContextNote: {
    name: (note, { lang }) => {
      const translations = note?.translations ?? [];
      const translatedText = translations.find(
        (t) => t && t.language_tag === localeMap[lang],
      )?.translated_name;
      return translatedText ?? note?.name ?? 'No name provided';
    },
    description: (note, { lang }) => {
      const translations = note?.translations ?? [];
      const translatedText = translations.find(
        (t) => t.language_tag === localeMap[lang],
      )?.translated_text;
      return translatedText ?? note?.description;
    },
  },
};
