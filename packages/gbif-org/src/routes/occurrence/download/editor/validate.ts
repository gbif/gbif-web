import { IntlShape } from '@formatjs/intl';

export type ValidationErrorType = 'invalid' | 'network-error';
export type ValidationError = { message: string; type: ValidationErrorType };
export type ValidationResponse = { text: string } | { error: ValidationError };

export async function validateSql(
  sql: string,
  formatMessage: IntlShape['formatMessage']
): Promise<ValidationResponse> {
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
          type: 'invalid',
          message: result.reason,
        },
      };
    }
    if (response.status > 299) {
      return {
        error: {
          type: 'invalid',
          message: formatMessage({
            id: 'download.sql.parsingErrorDescription',
            defaultMessage: 'Unable to parse SQL',
          }),
        },
      };
    }

    const result = await response.json();
    return { text: result.sql };
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

export async function validatePredicate(
  predicate: string,
  formatMessage: IntlShape['formatMessage']
): Promise<ValidationResponse> {
  try {
    JSON.parse(predicate);
  } catch (err) {
    return {
      error: {
        type: 'invalid',
        message: formatMessage({
          id: 'download.predicate.invalidJson',
          defaultMessage: 'The provided predicate is not valid JSON',
        }),
      },
    };
  }
  try {
    const response = await fetch(
      import.meta.env.PUBLIC_WEB_UTILS + '/validate-download-predicate',
      {
        method: 'POST',
        signal: AbortSignal.timeout(30000),
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          predicate: JSON.parse(predicate),
        }),
      }
    );

    if (response.status === 400) {
      const result = await response.json();
      return {
        error: {
          type: 'invalid',
          message: result.reason,
        },
      };
    }
    if (response.status > 299) {
      return {
        error: {
          type: 'invalid',
          message: formatMessage({
            id: 'download.predicate.parsingErrorDescription',
            defaultMessage: 'Unable to parse predicate',
          }),
        },
      };
    }

    const result = await response.json();
    if (!result.valid) {
      return {
        error: {
          type: 'invalid',
          message:
            result.message ||
            formatMessage({
              id: 'download.predicate.invalid',
              defaultMessage: 'The provided predicate is invalid',
            }),
        },
      };
    }
    return { text: predicate };
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
