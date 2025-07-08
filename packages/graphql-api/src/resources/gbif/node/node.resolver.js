/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
  Query: {
    nodeSearch: (parent, args, { dataSources }) =>
      dataSources.nodeAPI.searchNodes({ query: args }),
    node: (parent, { key }, { dataSources }) =>
      dataSources.nodeAPI.getNodeByKey({ key }),
    nodeCountry: (parent, { countryCode }, { dataSources }) =>
      dataSources.nodeAPI.getNodeByCountryCode({ countryCode }),
  },
  Node: {
    organization: ({ key }, args, { dataSources }) => {
      return dataSources.nodeAPI.getEndorsedOrganizations({ key, query: args });
    },
    pendingEndorsement: ({ key }, args, { dataSources }) => {
      return dataSources.nodeAPI.getOrganizationsPendingEndorsement({
        key,
        query: args,
      });
    },
    dataset: ({ key }, args, { dataSources }) => {
      return dataSources.nodeAPI.getDatasets({ key, query: args });
    },
    installation: ({ key }, args, { dataSources }) => {
      return dataSources.nodeAPI.getInstallations({ key, query: args });
    },
    contacts: async (node, { type }, { dataSources, locale }) => {
      let extendedContacts = node.contacts;

      try {
        const participantIdentifier = getDirectoryParticipantId(node);

        const participant =
          await dataSources.participantAPI.getParticipantByDirectoryId({
            id: participantIdentifier,
            locale,
          });

        extendedContacts = node.contacts.map((contact) => {
          const person = participant.people.find(
            (p) => p.person.id === contact.key,
          )?.person;
          return {
            ...contact,
            title: person?.title,
            surname: person?.surname,
          };
        });
      } catch (error) {
        console.error(error);
      }

      // filter contacts on type (array of strings)
      if (type) {
        return extendedContacts.filter((contact) =>
          type.includes(contact.type),
        );
      }
      return extendedContacts;
    },
    participant: (node, args, { dataSources, locale }) => {
      const participantIdentifier = getDirectoryParticipantId(node);
      if (participantIdentifier) {
        return dataSources.participantAPI.getParticipantByDirectoryId({
          id: participantIdentifier,
          locale,
        });
      }
      return null;
    },
    // A participant in the directory api can have multiple nodes. This is not used but handeld anyways
    directoryNodes: async (node, args, { dataSources, locale }) => {
      // There is no reference to the directory node on the node from the v1 api,
      // but there is a reference to the directory participant,
      // so we have to fetch the directory participant to get a reference to the directory node.
      // We can then use the directory node reference on the directory participant to the the directory node.
      const participantIdentifier = getDirectoryParticipantId(node);

      const participant =
        await dataSources.participantAPI.getParticipantByDirectoryId({
          id: participantIdentifier,
          locale,
        });

      const results = await Promise.allSettled(
        participant?.nodes?.map(({ id }) =>
          dataSources.nodeDirectoryAPI.getNodeByKey({
            key: id,
          }),
        ),
      );

      return results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value)
        .filter((value) => !value.deleted);
    },
  },
};

function getDirectoryParticipantId(node) {
  // First step is to extract the participantID from the list if identifiers on the node. This is a bit akward.
  const identifiers = node.identifiers || [];
  const participantIdentifier = identifiers.find(
    (i) => i.type === 'GBIF_PARTICIPANT',
  );

  return participantIdentifier?.identifier;
}
