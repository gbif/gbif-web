import { escape } from 'lodash';
import { highlight } from 'sql-highlight';

/**
 * The SQL of a download as highlighted HTML, for the sqlFormatted field, which the portal renders as HTML.
 * sql-highlight escapes the query itself. If it fails, the query is returned HTML-escaped and unhighlighted,
 * never as is, since users write it. This is a safeguard: sql-highlight only fails for values that aren't strings.
 */
export function formatSql(sql, highlightSql = highlight) {
  try {
    return highlightSql(sql, { html: true });
  } catch (err) {
    return typeof sql === 'string' ? escape(sql) : sql;
  }
}
