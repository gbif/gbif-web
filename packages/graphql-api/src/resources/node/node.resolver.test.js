/* eslint-env mocha */
import assert from 'assert';
import resolver from './node.resolver';
import { clearPublicDirectoryPersonCache } from '../directoryPerson/publicDirectoryPersons';

function createContext() {
  const none = { results: [] };
  const directoryAPI = {
    searchParticipants: async () => none,
    getBudgetCommitteeReport: async () => [],
    getExecutiveCommitteeReport: async () => [],
    getScienceCommitteeReport: async () => [],
    getNodeManagersCommitteeReport: async () => [],
    getNsgReport: async () => [],
    getSecretariatReport: async () => [],
  };
  return {
    dataSources: {
      participantAPI: { directoryAPI },
      nodeAPI: {
        searchNodes: async () => ({
          results: [
            {
              contacts: [{ key: 1, type: 'NODE_MANAGER' }, { key: 2, type: 'FUNDING_CONTACT' }, { key: 3 }],
            },
          ],
        }),
      },
      directoryPersonAPI: {
        searchPeopleByRole: async () => none,
        getDirectoryContactByKey: async ({ key }) => ({ institutionName: `Inst${key}` }),
        getProfilePicture: async ({ key }) => `IMG_${key}`,
      },
    },
  };
}

describe('node contact directory data', () => {
  beforeEach(() => clearPublicDirectoryPersonCache());
  const { institutionName, profilePicture } = resolver.Contact;

  it('only gives the institution and picture of public contacts', async () => {
    const ctx = createContext();
    assert.strictEqual(await institutionName({ key: 1 }, {}, ctx), 'Inst1');
    assert.strictEqual(await profilePicture({ key: 1 }, {}, ctx), 'IMG_1');
  });

  it('gives nothing for contacts with a non-public role', async () => {
    const ctx = createContext();
    assert.strictEqual(await institutionName({ key: 2 }, {}, ctx), null);
    assert.strictEqual(await profilePicture({ key: 2 }, {}, ctx), null);
  });

  it('gives untyped contacts the institution but no picture', async () => {
    const ctx = createContext();
    assert.strictEqual(await institutionName({ key: 3 }, {}, ctx), 'Inst3');
    assert.strictEqual(await profilePicture({ key: 3 }, {}, ctx), null);
  });
});
