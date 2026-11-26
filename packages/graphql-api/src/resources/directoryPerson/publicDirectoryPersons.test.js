/* eslint-env mocha */
import assert from 'assert';
import { clearPublicDirectoryPersonCache, getDirectoryAccess, isPublicDirectoryPerson } from './publicDirectoryPersons';

function createDataSources({ failNodes = false } = {}) {
  const calls = { participants: [], nodes: 0, volunteerRoles: [] };
  const participantsByGroup = {
    'COUNTRY:VOTING': [{ people: [{ person: { id: 1 } }] }],
    'COUNTRY:ASSOCIATE': [{ people: [{ person: { id: 2 } }] }],
    'OTHER:ASSOCIATE': [{ people: [] }, {}],
  };
  const directoryAPI = {
    searchParticipants: async ({ query }) => {
      calls.participants.push(query);
      return {
        results: participantsByGroup[`${query.type}:${query.participation_status}`],
      };
    },
    getBudgetCommitteeReport: async () => [{ personId: 3 }],
    getExecutiveCommitteeReport: async () => [{ personId: 4 }],
    getScienceCommitteeReport: async () => [{ personId: 5 }],
    getNodeManagersCommitteeReport: async () => [{ personId: 6 }],
    getNsgReport: async () => [{ id: 7 }],
    getSecretariatReport: async () => [{ id: '8' }],
  };
  const nodeAPI = {
    searchNodes: async () => {
      calls.nodes += 1;
      if (failNodes) throw new Error('upstream down');
      return {
        results: [
          { contacts: [{ key: 9 }, { key: 13, type: 'NODE_MANAGER' }, { key: 14, type: 'INVOICE_CONTACT' }] },
          {},
        ],
      };
    },
  };
  const directoryPersonAPI = {
    searchPeopleByRole: async ({ query }) => {
      calls.volunteerRoles.push(query.role);
      return {
        results: query.role === 'TRANSLATOR' ? [{ personId: 11 }, { personId: 12, term: { end: '2015-01-01' } }] : [],
      };
    },
  };
  return { calls, dataSources: { participantAPI: { directoryAPI }, nodeAPI, directoryPersonAPI } };
}

describe('isPublicDirectoryPerson', () => {
  beforeEach(() => clearPublicDirectoryPersonCache());

  it('allows people listed in the directory tables and node contacts', async () => {
    const { dataSources } = createDataSources();
    const ids = ['1', '2', '3', '4', '5', '6', '7', 8, '9', 11, 13];
    const results = await Promise.all(ids.map((id) => isPublicDirectoryPerson(id, dataSources)));
    assert.deepStrictEqual(
      results,
      ids.map(() => true),
    );
  });

  it('rejects people not shown on the website', async () => {
    const { dataSources } = createDataSources();
    const ids = ['10', '12', '14', '0', 'abc', '1 ', undefined];
    const results = await Promise.all(ids.map((id) => isPublicDirectoryPerson(id, dataSources)));
    assert.deepStrictEqual(
      results,
      ids.map(() => false),
    );
  });

  it('queries only the participant groups shown in the directory', async () => {
    const { calls, dataSources } = createDataSources();
    await isPublicDirectoryPerson('1', dataSources);
    assert.deepStrictEqual(
      calls.participants.map((q) => `${q.type}:${q.participation_status}`),
      ['COUNTRY:VOTING', 'COUNTRY:ASSOCIATE', 'OTHER:ASSOCIATE'],
    );
  });

  it('gives each source its access level and untyped node contacts the reduced one', async () => {
    const { dataSources } = createDataSources();
    const level = async (id) => getDirectoryAccess(id, dataSources);
    assert.strictEqual(await level('1'), 'full'); // participant table
    assert.strictEqual(await level('13'), 'full'); // node contact with a public role
    assert.strictEqual(await level('11'), 'volunteer'); // volunteer only
    assert.strictEqual(await level('9'), 'volunteer'); // node contact without a role
    assert.strictEqual(await level('14'), null); // node contact with a non-public role
    assert.strictEqual(await level('12'), null); // ended volunteer
  });

  it('includes volunteers for every volunteer role', async () => {
    const { calls, dataSources } = createDataSources();
    await isPublicDirectoryPerson('11', dataSources);
    assert.deepStrictEqual(calls.volunteerRoles.sort(), ['AMBASSADOR', 'MENTOR', 'REVIEWER', 'TRAINER', 'TRANSLATOR']);
  });

  it('caches the allowlist and shares concurrent loads', async () => {
    const { calls, dataSources } = createDataSources();
    await Promise.all([isPublicDirectoryPerson('1', dataSources), isPublicDirectoryPerson('2', dataSources)]);
    await isPublicDirectoryPerson('3', dataSources);
    assert.strictEqual(calls.nodes, 1);
  });

  it('fails closed and does not cache when an upstream call fails', async () => {
    const failing = createDataSources({ failNodes: true });
    await assert.rejects(isPublicDirectoryPerson('1', failing.dataSources));

    const healthy = createDataSources();
    assert.strictEqual(await isPublicDirectoryPerson('1', healthy.dataSources), true);
    assert.strictEqual(healthy.calls.nodes, 1);
  });
});
