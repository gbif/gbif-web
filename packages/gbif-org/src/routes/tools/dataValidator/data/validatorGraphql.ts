import type {
  DataValidatorEmlQuery,
  DataValidatorEmlQueryVariables,
  DataValidatorValidationQuery,
  DataValidatorValidationQueryVariables,
} from '@/gql/graphql';
import { GraphQLService } from '@/services/graphQLService';
import type { Validation } from './types';
import { isValidationKey, ValidatorHttpError } from './validatorApi';

const VALIDATION_QUERY = /* GraphQL */ `
  query DataValidatorValidation($key: ID!) {
    validation(key: $key) {
      key
      created
      modified
      file
      fileSize
      fileFormat
      status
      metrics {
        indexeable
        error
        stepTypes {
          stepType
          status
          executionOrder
          message
        }
        files {
          fileType
          fileName
          rowType
          count
          indexedCount
          extension {
            identifier
            title
            description
            url
          }
          terms {
            term
            rawIndexed
            interpretedIndexed
          }
          issues {
            issue
            issueCategory
            count
            severity
            samples {
              recordId
              relatedData
            }
          }
        }
      }
    }
  }
`;

const EML_QUERY = /* GraphQL */ `
  query DataValidatorEml($key: ID!) {
    validation(key: $key) {
      key
      eml
    }
  }
`;

type GraphQLErrorLike = {
  extensions?: { code?: string; response?: { status?: number } };
};

const STATUS_BY_CODE: Record<string, number> = {
  NOT_FOUND: 404,
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
};

// the GraphQL API passes the validator's HTTP status on in the error extensions
export function upstreamStatus(errors: GraphQLErrorLike[] | undefined): number | undefined {
  for (const error of errors ?? []) {
    const status =
      error.extensions?.response?.status ?? STATUS_BY_CODE[error.extensions?.code ?? ''];
    if (status) return status;
  }
  return undefined;
}

type QueryBase = { graphqlEndpoint: string; token: string; signal?: AbortSignal };

function toError(errors: GraphQLErrorLike[] | undefined, fallbackMessage?: string): Error {
  const status = upstreamStatus(errors);
  if (status) return new ValidatorHttpError(status);
  if (fallbackMessage) return new Error(fallbackMessage);
  return new ValidatorHttpError(404);
}

async function queryValidation<TData extends { validation?: unknown }, TVariables>(
  { graphqlEndpoint, token, signal }: QueryBase,
  query: string,
  variables: TVariables
): Promise<{ validation: NonNullable<TData['validation']>; errors?: GraphQLErrorLike[] }> {
  const service = new GraphQLService({
    endpoint: graphqlEndpoint,
    // nothing in a validation result is localised
    locale: 'en',
    abortSignal: signal,
    authorization: `Bearer ${token}`,
  });
  const response = await service.query<TData, TVariables>(query, variables);
  const body = await response.json();
  const errors = body.errors as GraphQLErrorLike[] | undefined;
  // a field error inside the validation still leaves a usable result
  if (body.data?.validation) {
    return { validation: body.data.validation as NonNullable<TData['validation']>, errors };
  }
  throw toError(errors, body.errors?.[0]?.message);
}

export async function fetchValidation({
  key,
  ...base
}: QueryBase & { key: string }): Promise<Validation> {
  if (!isValidationKey(key)) throw new ValidatorHttpError(404, 'Not a validation key');
  const { validation } = await queryValidation<
    DataValidatorValidationQuery,
    DataValidatorValidationQueryVariables
  >(base, VALIDATION_QUERY, { key });
  return validation;
}

export async function fetchEml({ key, ...base }: QueryBase & { key: string }): Promise<unknown> {
  if (!isValidationKey(key)) throw new ValidatorHttpError(404, 'Not a validation key');
  const { validation, errors } = await queryValidation<
    DataValidatorEmlQuery,
    DataValidatorEmlQueryVariables
  >(base, EML_QUERY, { key });
  if (validation.eml == null) throw toError(errors);
  return validation.eml;
}
