/* eslint-env mocha */
import assert from 'assert';
import DerivedDatasetAPI from './derivedDataset.source';

// Record the path each method asks for instead of calling the API.
function withRecordedPaths() {
  const source = new DerivedDatasetAPI({ apiv1: 'https://api.gbif.org/v1' });
  source.context = {};
  const paths = [];
  source.get = (path) => {
    paths.push(path);
    return Promise.resolve({});
  };
  return { source, paths };
}

// Invalid keys give not found, unsafe values in a path give bad user input.
const isRejected = (err) => ['NOT_FOUND', 'BAD_USER_INPUT'].includes(err?.extensions?.code);

describe('derived dataset paths', () => {
  it('builds paths from DOIs and usernames', async () => {
    const { source, paths } = withRecordedPaths();
    await source.getDerivedDataset({ key: '10.15468/dd.m9jcct' });
    await source.getContributingDatasetsByDerivedDatasetKey({
      key: '10.15468/dd.m9jcct',
    });
    await source.getUsersDerivedDataset({ username: 'jane.doe' });
    assert.deepStrictEqual(paths, [
      '/derivedDataset/10.15468/dd.m9jcct',
      '/derivedDataset/10.15468/dd.m9jcct/datasets',
      '/derivedDataset/user/jane.doe',
    ]);
  });

  ['10.15468/..', '10.15468/dd.x/../../admin', '../admin', '', null].forEach((key) => {
    it(`rejects key ${JSON.stringify(key)}`, async () => {
      const { source, paths } = withRecordedPaths();
      await assert.rejects(() => source.getDerivedDataset({ key }), isRejected);
      await assert.rejects(() => source.getContributingDatasetsByDerivedDatasetKey({ key }), isRejected);
      assert.deepStrictEqual(paths, []);
    });
  });

  ['../../admin/user/x', 'a\\b', '..', '', '\ud800'].forEach((username) => {
    it(`rejects username ${JSON.stringify(username)}`, async () => {
      const { source, paths } = withRecordedPaths();
      await assert.rejects(() => source.getUsersDerivedDataset({ username }), isRejected);
      assert.deepStrictEqual(paths, []);
    });
  });
});
