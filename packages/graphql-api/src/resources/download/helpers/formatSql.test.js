/* eslint-env mocha */
import assert from 'assert';
import { formatSql } from './formatSql';

const sql = "SELECT gbifid FROM occurrence WHERE recordedby = '<img src=x onerror=alert(1)>'";

describe('formatSql', () => {
  it('highlights the query, with HTML in it escaped', () => {
    const result = formatSql(sql);
    assert.ok(!result.includes('<img'), result);
    assert.ok(result.includes('sql-hl-keyword'), result);
  });

  it('escapes the query when highlighting fails', () => {
    const failing = () => {
      throw new Error('highlighting failed');
    };
    assert.equal(
      formatSql(sql, failing),
      'SELECT gbifid FROM occurrence WHERE recordedby = &#39;&lt;img src=x onerror=alert(1)&gt;&#39;',
    );
  });

  it('returns a missing query as is', () => {
    assert.equal(formatSql(null), null);
    assert.equal(formatSql(undefined), undefined);
  });
});
