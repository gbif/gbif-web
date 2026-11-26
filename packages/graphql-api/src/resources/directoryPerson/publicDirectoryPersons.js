// Person ids that the website lists publicly: the contact-us directory tables,
// the node contacts shown on country and participant pages and the volunteer lists.
// Only these may be looked up directly through `directoryContact(id)`.
//
// Default is not public: every source below is named explicitly, a role has to be listed in
// VALID_GBIF_ROLES (or be a volunteer role) to count, and a new role or list is not exposed until it is
// added here on purpose.

import { VALID_GBIF_ROLES, VOLUNTEER_ROLES } from './validGbifRoles';
import { isActiveTerm } from './activeTerm';

const TTL_MS = 10 * 60 * 1000;

let cached = null;
let pending = null;

const PARTICIPANT_GROUPS = [
  { type: 'COUNTRY', participation_status: 'VOTING' },
  { type: 'COUNTRY', participation_status: 'ASSOCIATE' },
  { type: 'OTHER', participation_status: 'ASSOCIATE' },
];

async function loadPublicPersonIds({ participantAPI, nodeAPI, directoryPersonAPI }) {
  const directory = participantAPI.directoryAPI;
  const [participantGroups, committees, nsg, secretariat, nodes, volunteers] = await Promise.all([
    Promise.all(PARTICIPANT_GROUPS.map((query) => directory.searchParticipants({ query: { limit: 1000, ...query } }))),
    Promise.all([
      directory.getBudgetCommitteeReport(),
      directory.getExecutiveCommitteeReport(),
      directory.getScienceCommitteeReport(),
      directory.getNodeManagersCommitteeReport(),
    ]),
    directory.getNsgReport(),
    directory.getSecretariatReport(),
    nodeAPI.searchNodes({ query: { limit: 1000 } }),
    Promise.all(VOLUNTEER_ROLES.map((role) => directoryPersonAPI.searchPeopleByRole({ query: { limit: 1000, role } }))),
  ]);

  // People that are only listed as volunteers get a reduced contact (see reduceVolunteerContact).
  const volunteerIds = volunteers
    .flatMap((response) => response.results.filter((r) => isActiveTerm(r.term)).map((r) => r.personId))
    .filter((id) => id != null)
    .map(String);

  const ids = [
    ...participantGroups.flatMap((response) =>
      response.results.flatMap((p) => (p.people ?? []).map((x) => x.person?.id)),
    ),
    ...committees.flat().map((member) => member.personId),
    ...nsg.map((member) => member.id),
    ...secretariat.map((member) => member.id),
    // node contacts shown on country pages; a contact with a role outside the public roles is not
    ...nodes.results.flatMap((node) =>
      (node.contacts ?? []).filter((c) => !c.type || VALID_GBIF_ROLES.has(c.type)).map((c) => c.key),
    ),
  ];

  return {
    ids: new Set(ids.filter((id) => id != null).map(String)),
    volunteerIds: new Set(volunteerIds),
  };
}

async function getPublicPersonIds(dataSources) {
  if (cached && cached.expires > Date.now()) return cached;
  if (!pending) {
    pending = loadPublicPersonIds(dataSources)
      .then((ids) => {
        cached = { ...ids, expires: Date.now() + TTL_MS };
        return cached;
      })
      .finally(() => {
        pending = null;
      });
  }
  return pending;
}

// 'full': listed in the directory tables or as a node contact, so the whole contact may be shown.
// 'volunteer': only listed as a volunteer, so only the fields of the volunteer policy may be shown.
// null: not public.
export async function getDirectoryAccess(id, dataSources) {
  const { ids, volunteerIds } = await getPublicPersonIds(dataSources);
  if (ids.has(String(id))) return 'full';
  if (volunteerIds.has(String(id))) return 'volunteer';
  return null;
}

export async function isPublicDirectoryPerson(id, dataSources) {
  return (await getDirectoryAccess(id, dataSources)) !== null;
}

export function clearPublicDirectoryPersonCache() {
  cached = null;
  pending = null;
}
