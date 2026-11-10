// Person ids that the website lists publicly: the contact-us directory tables
// and the node contacts shown on country and participant pages.
// Only these may be looked up directly through `directoryContact(id)`.

const TTL_MS = 10 * 60 * 1000;

let cached = null;
let pending = null;

const PARTICIPANT_GROUPS = [
  { type: 'COUNTRY', participation_status: 'VOTING' },
  { type: 'COUNTRY', participation_status: 'ASSOCIATE' },
  { type: 'OTHER', participation_status: 'ASSOCIATE' },
];

async function loadPublicPersonIds({ participantAPI, nodeAPI }) {
  const directory = participantAPI.directoryAPI;
  const [participantGroups, committees, nsg, secretariat, nodes] = await Promise.all([
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
  ]);

  const ids = [
    ...participantGroups.flatMap((response) =>
      response.results.flatMap((p) => (p.people ?? []).map((x) => x.person?.id)),
    ),
    ...committees.flat().map((member) => member.personId),
    ...nsg.map((member) => member.id),
    ...secretariat.map((member) => member.id),
    ...nodes.results.flatMap((node) => (node.contacts ?? []).map((c) => c.key)),
  ];

  return new Set(ids.filter((id) => id != null).map(String));
}

async function getPublicPersonIds(dataSources) {
  if (cached && cached.expires > Date.now()) return cached.ids;
  if (!pending) {
    pending = loadPublicPersonIds(dataSources)
      .then((ids) => {
        cached = { ids, expires: Date.now() + TTL_MS };
        return ids;
      })
      .finally(() => {
        pending = null;
      });
  }
  return pending;
}

export async function isPublicDirectoryPerson(id, dataSources) {
  const ids = await getPublicPersonIds(dataSources);
  return ids.has(String(id));
}

export function clearPublicDirectoryPersonCache() {
  cached = null;
  pending = null;
}
