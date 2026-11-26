import { GraphQLError } from 'graphql';
import { NotFoundError } from '../../helpers/GraphQL404Error';
import { getDirectoryAccess } from './publicDirectoryPersons';
import { isActiveTerm } from './activeTerm';
import { sanitizeUpstreamError } from './upstreamError';
import { VOLUNTEER_ROLES } from './validGbifRoles';

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
// every row of a list resolves its person with a separate upstream call, so the page size is capped
const MAX_LIMIT = 1000;
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

export default {
  Query: {
    directoryVolunteers: (parent, { role, limit, offset }, { dataSources }) => {
      // only the volunteer roles are public, never let the client pick an arbitrary directory role
      if (!VOLUNTEER_ROLES.includes(role)) {
        throw new GraphQLError(`role must be one of ${VOLUNTEER_ROLES.join(', ')}`, {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }
      return dataSources.directoryPersonAPI
        .searchPeopleByRole({
          query: { limit: clamp(limit ?? MAX_LIMIT, 1, MAX_LIMIT), offset: Math.max(offset ?? 0, 0), role },
        })
        .then((response) => ({ ...response, results: response.results.filter((r) => isActiveTerm(r.term)) }));
    },
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
      // the allowlist is built from several directory and registry sources, none of their errors may reach the client
      const access = await getDirectoryAccess(id, dataSources).catch((err) => {
        throw sanitizeUpstreamError(err);
      });
      if (!access) {
        throw new NotFoundError();
      }
      return dataSources.directoryPersonAPI.getDirectoryContactByKey({
        key: id,
        restricted: access === 'volunteer',
      });
    },
  },
  DirectoryVolunteerRole: {
    Person: ({ personId }, args, { dataSources }) =>
      dataSources.directoryPersonAPI.getVolunteerByKey({ key: personId }),
  },
  DirectoryContact: {
    profilePicture: ({ id, restricted }, args, { dataSources }) =>
      restricted
        ? null
        : dataSources.directoryPersonAPI.getProfilePicture({
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
