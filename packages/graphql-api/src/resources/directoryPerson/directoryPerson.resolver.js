import { NotFoundError } from '../../helpers/GraphQL404Error';
import { isPublicDirectoryPerson } from './publicDirectoryPersons';

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
  Query: {
    directoryTranslators: (parent, { limit, offset }, { dataSources }) =>
      dataSources.directoryPersonAPI.searchPeopleByRole({
        query: { limit, offset, role: 'TRANSLATOR' },
      }),
    directoryAmbassadors: (parent, { limit, offset }, { dataSources }) =>
      dataSources.directoryPersonAPI.searchPeopleByRole({
        query: { limit, offset, role: 'AMBASSADOR' },
      }),
    directoryMentors: (parent, { limit, offset }, { dataSources }) =>
      dataSources.directoryPersonAPI.searchPeopleByRole({
        query: { limit, offset, role: 'MENTOR' },
      }),
    directoryAwardWinners: (parent, { award = [] }, { dataSources }) =>
      dataSources.directoryPersonAPI
        .searchPeopleByRole({ query: { role: 'AWARD_WINNER' } })
        .then((response) => {
          if (award.length === 0) {
            return response.results;
          }
          const filtered = response.results.filter((person) => {
            return award.includes(person.award);
          });
          return filtered;
        })
        .then((response) => {
          // remove duplicate persons
          const unique = response.filter(
            (person, index, self) => index === self.findIndex((p) => p.personId === person.personId),
          );
          // expand the person object
          return Promise.all(
            unique.map((person) => {
              return dataSources.directoryPersonAPI.getAwardWinnerByKey({ key: person.personId }).then((p) => {
                // if award is specified in query, then only show matching awards
                if (award.length === 0) return p;
                return { ...p, roles: p.roles.filter((role) => award.includes(role.award)) };
              });
            }),
          );
        }),
    directoryContact: async (parent, { id }, { dataSources }) => {
      if (!(await isPublicDirectoryPerson(id, dataSources))) {
        throw new NotFoundError();
      }
      return dataSources.directoryPersonAPI.getDirectoryContactByKey({
        key: id,
      });
    },
  },
  DirectoryTranslatorRole: {
    Person: ({ personId }, args, { dataSources }) =>
      dataSources.directoryPersonAPI.getTranslatorByKey({ key: personId }),
  },
  DirectoryAmbassadorRole: {
    Person: ({ personId }, args, { dataSources }) =>
      dataSources.directoryPersonAPI.getAmbassadorByKey({ key: personId }),
  },
  DirectoryMentorRole: {
    Person: ({ personId }, args, { dataSources }) => dataSources.directoryPersonAPI.getMentorByKey({ key: personId }),
  },
  DirectoryContact: {
    profilePicture: ({ id }, args, { dataSources }) =>
      dataSources.directoryPersonAPI.getProfilePicture({
        key: id,
        query: { ...args, base64: true },
      }),
    participants: ({ participants }, args, { dataSources }) => {
      return Promise.all(
        participants.map((participant) =>
          dataSources.participantAPI.getParticipantByDirectoryId({
            id: participant.participantId,
          }),
        ),
      );
    },
  },
};
