import { getHtml } from '#/helpers/utils';

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
  Query: {
    participantSearch: (parent, args, { dataSources, locale }) =>
      dataSources.participantAPI.searchParticipants({ query: args }, locale),
    participant: (parent, { key }, { dataSources, locale }) =>
      dataSources.participantAPI.getParticipantByDirectoryId({
        id: key,
        locale,
      }),
    nodeSteeringGroup: (parent, args, { dataSources }) =>
      dataSources.participantAPI.getNsgReport(),
  },
  NsgMember: {
    contact: ({ id: personId }, args, { dataSources }) => {
      // first get the person from the directory. And then take the first participant from the person object. And resolve that participant
      return dataSources.directoryPersonAPI.getDirectoryContactByKey({
        key: personId,
      });
    },
  },
  Participant: {
    progressAndPlans: ({ progressAndPlans }) => getHtml(progressAndPlans),
    nodeMission: ({ nodeMission }) => getHtml(nodeMission),
    nodeHistory: ({ nodeHistory }) => getHtml(nodeHistory),
    nodeFunding: ({ nodeFunding }) => getHtml(nodeFunding),
    nodeStructure: ({ nodeStructure }) => getHtml(nodeStructure),
  },
};
