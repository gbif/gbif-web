/* eslint-env mocha */
import assert from 'assert';
import DownloadAPI from './download.source';

// Record the path each method asks for instead of calling the API.
function withRecordedPaths() {
  const source = new DownloadAPI({ apiv1: 'https://api.gbif.org/v1' });
  source.context = {};
  const paths = [];
  source.get = (path) => {
    paths.push(path);
    return Promise.resolve({});
  };
  return { source, paths };
}

describe('download paths', () => {
  it('builds paths from download keys, DOIs and usernames', async () => {
    const { source, paths } = withRecordedPaths();
    await source.getDownloadByKey({ key: '0024818-261023074918325' });
    await source.getDownloadByKey({ key: '10.15468/dl.4fffwn' });
    await source.getEventDownloadByKey({ key: '0000001-261023074918325' });
    await source.getContributingDatasetsByDownloadKey({
      key: '0024818-261023074918325',
    });
    await source.getContributingDatasetsByEventDownloadKey({
      key: '10.15468/dl.4fffwn',
    });
    await source.getUsersDownloads({ username: 'jane.doe' });
    await source.getUsersEventDownloads({ username: '../../admin/user/x' });
    await source.datasetDownloads({
      query: { datasetKey: '50c9509d-22c7-4a22-a47d-8c48425ef4a7' },
    });
    assert.deepStrictEqual(paths, [
      '/occurrence/download/0024818-261023074918325',
      '/occurrence/download/10.15468/dl.4fffwn',
      '/experimental/event/download/0000001-261023074918325',
      '/occurrence/download/0024818-261023074918325/datasets',
      '/experimental/event/download/10.15468/dl.4fffwn/datasets',
      '/occurrence/download/user/jane.doe',
      '/experimental/event/download/user/..%2F..%2Fadmin%2Fuser%2Fx',
      '/occurrence/download/dataset/50c9509d-22c7-4a22-a47d-8c48425ef4a7',
    ]);
  });

  [
    '../../admin/user/x',
    '0024818-261023074918325/../x',
    '.. ',
    '1?x=y',
    '',
    null,
    '10.15468/a/b',
    '10.15468/..',
  ].forEach((key) => {
    it(`rejects download key ${JSON.stringify(key)}`, async () => {
      const { source, paths } = withRecordedPaths();
      await assert.rejects(() => source.getDownloadByKey({ key }));
      await assert.rejects(() => source.getEventDownloadByKey({ key }));
      await assert.rejects(() => source.getContributingDatasetsByDownloadKey({ key }));
      assert.deepStrictEqual(paths, []);
    });
  });

  it('rejects dataset keys that are not UUIDs', async () => {
    const { source, paths } = withRecordedPaths();
    await assert.rejects(() => source.datasetDownloads({ query: { datasetKey: '../x' } }));
    assert.deepStrictEqual(paths, []);
  });
});
