import config from '#/config';
import logger from '#/logger';
import { PluginDefinition } from 'apollo-server-core'

export const errorLoggingPlugin: PluginDefinition = {
  async requestDidStart() {
    return {
      async didEncounterErrors(requestContext) {
        const date = new Date();

        logger.error({
          message: 'GraphQL error',
          time: date.toISOString(),
          timeInCopenhagen: date.toLocaleString('da-DK', { timeZone: 'Europe/Copenhagen' }),
          request: {
            operationName: requestContext.request.operationName,
            query: requestContext.request.query,
            variables: requestContext.request.variables,
            headers: Object.fromEntries(requestContext.request.http?.headers.entries() as any),
          },
          origin: config.origin,
          errors: requestContext.errors,
          playgroundLink: `${config.origin}/graphql?query=${encodeURIComponent(requestContext.request.query!)}`
        });
      }
    }
  },
  
}