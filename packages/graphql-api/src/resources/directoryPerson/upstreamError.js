import { GraphQLError } from 'graphql';
import { NotFoundError } from '../../helpers/GraphQL404Error';

/**
 * The directory API is private. A failed request normally becomes an error that carries the upstream URL,
 * status and response body to the client, so replace it with an error that says nothing about the upstream.
 * The original error stays attached for server side logging, it is not part of the response.
 */
export function sanitizeUpstreamError(err) {
  if (err instanceof GraphQLError && !err.extensions?.response) return err;
  if (err?.extensions?.response?.status === 404) return new NotFoundError();
  return new GraphQLError('The directory request failed', {
    originalError: err instanceof Error ? err : undefined,
    extensions: { code: 'UPSTREAM_ERROR' },
  });
}
