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

describe('derived dataset paths', () => {
  it('builds paths from DOIs and usernames', async () => {
    const { source, paths } = withRecordedPaths();
    await source.getDerivedDataset({ key: '10.15468/dd.m9jcct' });
    await source.getContributingDatasetsByDerivedDatasetKey({
      key: '10.15468/dd.m9jcct',
    });
    await source.getUsersDerivedDataset({ username: 'jane.doe' });
    await source.getUsersDerivedDataset({ username: '../../admin/user/x' });
    assert.deepStrictEqual(paths, [
      '/derivedDataset/10.15468/dd.m9jcct',
      '/derivedDataset/10.15468/dd.m9jcct/datasets',
      '/derivedDataset/user/jane.doe',
      '/derivedDataset/user/..%2F..%2Fadmin%2Fuser%2Fx',
    ]);
  });

  ['10.15468/..', '10.15468/dd.x/../../admin', '../admin', '', null].forEach((key) => {
    it(`rejects key ${JSON.stringify(key)}`, async () => {
      const { source, paths } = withRecordedPaths();
      await assert.rejects(() => source.getDerivedDataset({ key }));
      await assert.rejects(() => source.getContributingDatasetsByDerivedDatasetKey({ key }));
      assert.deepStrictEqual(paths, []);
    });
  });
});
