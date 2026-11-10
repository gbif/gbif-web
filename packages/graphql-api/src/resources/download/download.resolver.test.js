/* eslint-env mocha */
import assert from 'assert';
import resolvers from './download.resolver';

describe('DownloadRequest.sqlFormatted', () => {
  const { sqlFormatted } = resolvers.DownloadRequest;

  it('escapes HTML in the query, since the result is rendered as HTML', () => {
    const result = sqlFormatted({
      sql: "SELECT gbifid FROM occurrence WHERE recordedby = '<img src=x onerror=alert(1)>'",
    });
    assert.ok(!result.includes('<img'), result);
    assert.ok(result.includes('&lt;img src=x onerror=alert(1)&gt;'), result);
  });

  it('returns a missing query as is', () => {
    assert.equal(sqlFormatted({ sql: null }), null);
    assert.equal(sqlFormatted({}), undefined);
  });
});
