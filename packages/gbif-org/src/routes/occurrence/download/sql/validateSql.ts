import { IntlShape } from '@formatjs/intl';

export type ValidationErrorType = 'invalid-SQL' | 'network-error';
export type SQLValidationError = { message: string; type: ValidationErrorType };

export async function validateSql(
  sql: string,
  formatMessage: IntlShape['formatMessage']
): Promise<{ sql: string } | { error: SQLValidationError }> {
  try {
    const response = await fetch(
      import.meta.env.PUBLIC_API_V1 + '/occurrence/download/request/validate',
      {
        method: 'POST',
        signal: AbortSignal.timeout(30000),
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          format: 'SQL_TSV_ZIP',
          sql: sql,
        }),
      }
    );

    if (response.status === 400) {
      const result = await response.json();
      return {
        error: {
          type: 'invalid-SQL',
          message: result.reason,
        },
      };
    }
    if (response.status > 299) {
      return {
        error: {
          type: 'invalid-SQL',
          message: formatMessage({
            id: 'download.sql.parsingErrorDescription',
            defaultMessage: 'Unable to parse SQL',
          }),
        },
      };
    }

    const result = await response.json();
    return { sql: result.sql };
  } catch (e) {
    return {
      error: {
        type: 'network-error',
        message: formatMessage({
          id: 'download.sql.networkErrorDescription',
          defaultMessage: 'Could not validate SQL because of a network error',
        }),
      },
    };
  }
}
