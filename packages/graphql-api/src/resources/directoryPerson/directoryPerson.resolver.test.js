/* eslint-env mocha */
import assert from 'assert';
import resolver from './directoryPerson.resolver';
import { clearPublicDirectoryPersonCache } from './publicDirectoryPersons';

function createContext({ people = {}, roleResults = {} } = {}) {
  const searches = [];
  const none = { results: [] };
  const directoryPersonAPI = {
    searchPeopleByRole: async ({ query }) => {
      searches.push(query);
      return roleResults[query.role] ?? none;
    },
    getDirectoryContactByKey: async ({ key, restricted }) => ({ key, restricted }),
    getProfilePicture: async () => 'picture',
  };
  const directoryAPI = {
    searchParticipants: async () => none,
    getBudgetCommitteeReport: async () => [],
    getExecutiveCommitteeReport: async () => [],
    getScienceCommitteeReport: async () => [],
    getNodeManagersCommitteeReport: async () => [],
    getNsgReport: async () => [],
    getSecretariatReport: async () => (people.secretariat ?? []).map((id) => ({ id })),
  };
  const dataSources = {
    directoryPersonAPI,
    participantAPI: { directoryAPI },
    nodeAPI: { searchNodes: async () => none },
  };
  return { searches, context: { dataSources } };
}

describe('directoryVolunteers resolver', () => {
  beforeEach(() => clearPublicDirectoryPersonCache());
  const call = (ctx, args) => resolver.Query.directoryVolunteers({}, args, ctx.context);

  it('rejects roles that are not volunteer roles', async () => {
    const ctx = createContext();
    for (const role of ['FUNDING_CONTACT', 'translator', 'GOVERNING_BOARD_CHAIR', '']) {
      assert.throws(() => call(ctx, { role }), /role must be one of/);
    }
    assert.strictEqual(ctx.searches.length, 0);
  });

  it('clamps limit and offset before calling the directory', async () => {
    const ctx = createContext();
    await call(ctx, { role: 'TRANSLATOR', limit: 100000, offset: -5 });
    await call(ctx, { role: 'TRANSLATOR', limit: -1 });
    await call(ctx, { role: 'TRANSLATOR' });
    assert.deepStrictEqual(
      ctx.searches.map((q) => [q.limit, q.offset]),
      [
        [1000, 0],
        [1, 0],
        [1000, 0],
      ],
    );
  });

  it('leaves out people whose term has ended', async () => {
    const ctx = createContext({
      roleResults: {
        AMBASSADOR: {
          count: 3,
          results: [
            { personId: 1, term: { start: '2020-01-01', end: null } },
            { personId: 2, term: { start: '2010-01-01', end: '2015-01-01' } },
            { personId: 3 },
          ],
        },
      },
    });
    const result = await call(ctx, { role: 'AMBASSADOR' });
    assert.deepStrictEqual(
      result.results.map((r) => r.personId),
      [1, 3],
    );
  });
});

describe('directoryContact resolver', () => {
  beforeEach(() => clearPublicDirectoryPersonCache());
  const call = (ctx, id) => resolver.Query.directoryContact({}, { id }, ctx.context);

  it('gives volunteers a restricted contact and other listed people the full one', async () => {
    const ctx = createContext({
      people: { secretariat: [7] },
      roleResults: {
        TRANSLATOR: {
          results: [
            { personId: 5, term: {} },
            { personId: 7, term: {} },
          ],
        },
      },
    });
    assert.deepStrictEqual(await call(ctx, '5'), { key: '5', restricted: true });
    // listed in the directory tables as well, so the volunteer limits do not apply
    assert.deepStrictEqual(await call(ctx, '7'), { key: '7', restricted: false });
  });

  it('does not find volunteers with ended terms or unknown people', async () => {
    const ctx = createContext({
      roleResults: { MENTOR: { results: [{ personId: 9, term: { end: '2015-01-01' } }] } },
    });
    await assert.rejects(call(ctx, '9'), /404/);
    await assert.rejects(call(ctx, '10'), /404/);
  });

  it('does not echo upstream errors raised while building the allowlist', async () => {
    const ctx = createContext();
    ctx.context.dataSources.participantAPI.directoryAPI.getNsgReport = async () => {
      throw Object.assign(new Error('boom'), {
        extensions: { response: { url: 'http://internal/v1/directory/report/5', status: 500, body: 'SECRET' } },
      });
    };
    await assert.rejects(call(ctx, '1'), (err) => {
      const json = JSON.stringify(err.toJSON());
      assert.strictEqual(json.includes('internal'), false);
      assert.strictEqual(json.includes('SECRET'), false);
      return true;
    });
  });

  it('does not load the profile picture of restricted contacts', async () => {
    const ctx = createContext();
    const picture = resolver.DirectoryContact.profilePicture;
    assert.strictEqual(await picture({ id: 1, restricted: true }, {}, ctx.context), null);
    assert.strictEqual(await picture({ id: 1 }, {}, ctx.context), 'picture');
  });
});
