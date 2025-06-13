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
    contacts: ({ contacts }, { type }) => {
      // filter contacts on type (array of strings)
      if (type) {
        return contacts.filter((contact) => type.includes(contact.type));
      }
      return contacts;
    },
    participant: (node, args, { dataSources, locale }) => {
      // First step is to extract the participantID from the list if identifiers on the node. This is a bit akward.
      const identifiers = node.identifiers || [];
      const participantIdentifier = identifiers.find(
        (i) => i.type === 'GBIF_PARTICIPANT',
      );
      if (participantIdentifier) {
        return dataSources.participantAPI.getParticipantByDirectoryId({
          id: participantIdentifier.identifier,
          locale,
        });
      }
      return null;
    },
  },
};
