import { createLocalizedGbifHref, excerpt, getHtml } from '#/helpers/utils';

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
    gbifProject: (_, { id }, { dataSources, locale, preview }) =>
      dataSources.resourceAPI.getEntryById({ id, preview, locale }),
  },
  GbifProject: {
    title: (src, _, { locale }) =>
      getHtml(src.title, {
        inline: true,
        locale,
        allowedTags: ['em', 'i', 'strong'],
      }),
    body: (src, _, { locale }) =>
      getHtml(src.body, { trustLevel: 'trusted', wrapTables: true, locale }),
    summary: (src, _, { locale }) => getHtml(src.summary, { locale }),
    excerpt: (src, _, { locale }) => excerpt(src, { locale }),
    leadContact: (src, _, { locale }) => getHtml(src.leadContact, { locale }),
    events: (src, _, { dataSources, locale, preview }) => {
      if (!isNoneEmptyArray(src.events)) return null;

      const ids = src.events.map((event) => event.id);
      return Promise.all(
        ids.map((id) =>
          dataSources.resourceAPI.getEntryById({ id, preview, locale }),
        ),
      );
    },
    news: (src, _, { dataSources, locale, preview }) => {
      if (!isNoneEmptyArray(src.news)) return null;

      const ids = src.news.map((news) => news.id);
      return Promise.all(
        ids.map((id) =>
          dataSources.resourceAPI.getEntryById({ id, preview, locale }),
        ),
      );
    },
    call: (src, _, { dataSources, locale, preview }) => {
      if (!src?.call?.id) return null;
      return dataSources.resourceAPI.getEntryById({
        id: src.call.id,
        preview,
        locale,
      });
    },
    gbifHref: (src, _, { locale }) =>
      createLocalizedGbifHref(locale, 'project', src.id),
    programme: (src, _, { dataSources, locale, preview }) => {
      if (!src?.programme?.id) return null;
      return dataSources.resourceAPI.getEntryById({
        id: src.programme.id,
        preview,
        locale,
      });
    },
    additionalPartners: (src, _, { dataSources, locale, preview }) => {
      if (!isNoneEmptyArray(src.additionalPartners)) return null;

      const ids = src.additionalPartners.map((partner) => partner.id);
      return Promise.all(
        ids.map(async (id) => {
          const resource = await dataSources.resourceAPI.getEntryById({
            id,
            preview,
            locale,
          });
          if (!resource) return null;

          if (resource.contentType === 'participant') {
            return dataSources.participantAPI.mergeParticipantDirectoryData(
              resource,
            );
          }

          return resource;
        }),
      );
    },
    fundingOrganisations: (src, _, { dataSources, locale, preview }) => {
      if (!isNoneEmptyArray(src.fundingOrganisations)) return null;

      const ids = src.fundingOrganisations.map((partner) => partner.id);
      return Promise.all(
        ids.map(async (id) => {
          const resource = await dataSources.resourceAPI.getEntryById({
            id,
            preview,
            locale,
          });
          if (!resource) return null;

          if (resource.contentType === 'participant') {
            return dataSources.participantAPI.mergeParticipantDirectoryData(
              resource,
            );
          }

          return resource;
        }),
      );
    },
    overrideProgrammeFunding: (src, _, { dataSources, locale, preview }) => {
      if (!isNoneEmptyArray(src.overrideProgrammeFunding)) return null;

      const ids = src.overrideProgrammeFunding.map((programme) => programme.id);
      return Promise.all(
        ids.map((id) =>
          dataSources.resourceAPI.getEntryById({ id, preview, locale }),
        ),
      );
    },
    leadPartner: async (src, _, { dataSources, locale, preview }) => {
      if (!src.leadPartner?.id) return null;
      const resource = await dataSources.resourceAPI.getEntryById({
        id: src.leadPartner.id,
        preview,
        locale,
      });
      if (!resource) return null;

      if (resource.contentType === 'participant') {
        return dataSources.participantAPI.mergeParticipantDirectoryData(
          resource,
        );
      }

      return resource;
    },
  },
  ParticipantOrFundingOrganisation: {
    __resolveType: (src) => {
      if (src.contentType === 'organisation') return 'FundingOrganisation';
      return 'Participant';
    },
  },
};
