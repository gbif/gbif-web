import config from '#/config';
import logger from '#/logger';
import { PluginDefinition } from 'apollo-server-core'

const SLOW_QUERY_THRESHOLD_MS = 500;

export const slowQueryLoggingPlugin: PluginDefinition = {
  async requestDidStart() {
    const startTime = process.hrtime();

    return {
      async willSendResponse(requestContext) {
        const executionTime = process.hrtime(startTime);
        const elapsedMilliseconds = (executionTime[0] * 1e9 + executionTime[1]) / 1e6;

        if (elapsedMilliseconds > SLOW_QUERY_THRESHOLD_MS) {
          const date = new Date();

          logger.warn({
            message: 'Slow query',
            time: date.toISOString(),
            timeInCopenhagen: date.toLocaleString('da-DK', { timeZone: 'Europe/Copenhagen' }),
            executionTimeMs: Math.round(elapsedMilliseconds),
            request: {
              operationName: requestContext.request.operationName,
              query: requestContext.request.query,
              variables: requestContext.request.variables,
              headers: Object.fromEntries(requestContext.request.http?.headers.entries() as any),
            },
            origin: config.origin,
            errors: requestContext.errors,
            // TODO: Add link to graphql playground
          });
        }
      },
    }
  },
}