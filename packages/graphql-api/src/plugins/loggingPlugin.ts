import { ApolloServerPlugin } from '@apollo/server';
import config from '@/config';
import logger from '@/logger';

// Overload 503s can arrive in floods. Serializing the full query/variables/
// headers and writing a log line per shed request would make the logging itself
// a major event-loop cost during the exact moment the process is overloaded, so
// we throttle them to a periodic count instead.
let shedSinceLastLog = 0;
let lastShedLogAt = 0;
const SHED_LOG_INTERVAL_MS = 1000;

const loggingPlugin: ApolloServerPlugin = {
  async requestDidStart(rc) {
    // Don't log introspection queries
    if (rc?.request?.operationName === 'IntrospectionQuery') return;

    const startTime = process.hrtime();
    let errorHasBeenLogged = false;

    return {
      async didEncounterErrors(requestContext) {
        const date = new Date();
        const firstMessage = requestContext?.errors?.[0]?.message;
        if (firstMessage?.includes('The user aborted a request')) {
          // This is a common error when the user navigates away or cancels the request.
          // We don't want to log this as an error.
          return;
        }

        // Check if this is a 404 error - these are often expected and should be warnings
        const is404Error = requestContext?.errors?.some(
          (error) =>
            error.message?.includes('404: Not Found') ||
            error.message?.includes('404') ||
            (error.extensions?.http as { status?: number })?.status === 404,
        );

        // Our own load shedding is expected backpressure — log it cheaply. Match
        // strictly on the marker we set in PoolOverloadError, NOT on a 503 status
        // or SERVICE_UNAVAILABLE code, which an upstream can also produce and
        // which we DO want fully logged.
        const isOverloadError = requestContext?.errors?.some(
          (error) => error.extensions?.loadShed === true,
        );

        // Cheap, throttled accounting for shed requests — no payload
        // serialization, at most one line per interval.
        if (isOverloadError) {
          errorHasBeenLogged = true;
          shedSinceLastLog += 1;
          const now = Date.now();
          if (now - lastShedLogAt >= SHED_LOG_INTERVAL_MS) {
            logger.warn({
              message: 'GraphQL 503 (Overloaded - load shed)',
              time: date.toISOString(),
              shedCount: shedSinceLastLog,
              intervalMs: now - lastShedLogAt,
            });
            shedSinceLastLog = 0;
            lastShedLogAt = now;
          }
          return;
        }

        // An upstream timeout (our pool timeout) is an operational event worth
        // surfacing — but as a clear timeout, not the generic abort it would
        // otherwise be suppressed as above.
        const isUpstreamTimeout = requestContext?.errors?.some(
          (error) =>
            (error.extensions as { poolTimeout?: boolean })?.poolTimeout ===
            true,
        );

        let logLevel: 'warn' | 'error' = 'error';
        let logMessage = 'GraphQL Error';
        if (isUpstreamTimeout) {
          logLevel = 'warn';
          logMessage = 'GraphQL Upstream Timeout (504)';
        } else if (is404Error) {
          logLevel = 'warn';
          logMessage = 'GraphQL 404 (Expected)';
        }

        logger[logLevel]({
          message: logMessage,
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
            requestContext?.request?.query ?? '',
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
            requestContext?.request?.query ?? '',
          )}`,
        });
      },
    };
  },
};

export default loggingPlugin;
