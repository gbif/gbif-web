import config from '#/config';
import logger from '#/logger';
import { PluginDefinition } from 'apollo-server-core';

export const loggingPlugin: PluginDefinition = {
  async requestDidStart(rc) {
    // Don't log introspection queries
    if (rc?.request?.operationName === 'IntrospectionQuery') return;

    const startTime = process.hrtime();
    let errorHasBeenLogged = false;

    return {
      async didEncounterErrors(requestContext) {
        const date = new Date();

        logger.error({
          message: 'GraphQL Error',
          time: date.toISOString(),
          timeInCopenhagen: date.toLocaleString('en-GB', {
            timeZone: 'Europe/Copenhagen',
          }),
          request: {
            operationName: requestContext?.request?.operationName,
            query: requestContext?.request?.query,
            variables: requestContext?.request?.variables,
            headers: Object.fromEntries(
              requestContext?.request?.http?.headers.entries() as any,
            ),
          },
          errors: requestContext.errors,
          playgroundLink: `${config.origin}/graphql?query=${encodeURIComponent(
            requestContext?.request?.query!,
          )}`,
        });

        errorHasBeenLogged = true;
      },
      async willSendResponse(requestContext) {
        // Don't log if we've already logged an error on the current request
        if (errorHasBeenLogged) return;

        const executionTime = process.hrtime(startTime);
        const elapsedMilliseconds =
          (executionTime[0] * 1e9 + executionTime[1]) / 1e6;

        const date = new Date();

        logger.info({
          message: 'GraphQL Query',
          time: date.toISOString(),
          timeInCopenhagen: date.toLocaleString('en-GB', {
            timeZone: 'Europe/Copenhagen',
          }),
          executionTimeMs: Math.round(elapsedMilliseconds),
          request: {
            operationName: requestContext?.request?.operationName,
            query: requestContext?.request?.query,
            variables: requestContext?.request?.variables,
            headers: Object.fromEntries(
              (requestContext?.request?.http?.headers?.entries() as any) ?? [],
            ),
          },
          errors: requestContext?.errors,
          playgroundLink: `${config.origin}/graphql?query=${encodeURIComponent(
            requestContext?.request?.query!,
          )}`,
        });
      },
    };
  },
};
