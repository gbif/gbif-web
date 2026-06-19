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
    let skipWillSendResponse = false;

    return {
      async didEncounterErrors(requestContext) {
        // Our own load shedding is expected backpressure — log it cheaply. Match
        // strictly on the marker we set in PoolOverloadError, NOT on a 503 status
        // or SERVICE_UNAVAILABLE code, which an upstream can also produce and
        // which we DO want fully logged.
        const isOverloadError = requestContext?.errors?.some((error) => error.extensions?.loadShed === true);

        // Throttled logging of shed requests — no payload
        // serialization, at most one line per interval.
        if (isOverloadError) {
          skipWillSendResponse = true;
          shedSinceLastLog += 1;
          const now = Date.now();
          if (now - lastShedLogAt >= SHED_LOG_INTERVAL_MS) {
            logger.warn({
              message: 'GraphQL 503 (Overloaded - load shed)',
              shedCount: shedSinceLastLog,
              intervalMs: now - lastShedLogAt,
            });
            shedSinceLastLog = 0;
            lastShedLogAt = now;
          }
        }
      },
      async willSendResponse(requestContext) {
        if (skipWillSendResponse) return;

        // response.http.status is only set by Apollo when it differs from 200,
        // so fall back to 200 when it is absent.
        const statusCode = requestContext?.response?.http?.status ?? 200;

        const { errors } = requestContext;

        const executionTime = process.hrtime(startTime);
        const elapsedMilliseconds = (executionTime[0] * 1e9 + executionTime[1]) / 1e6;

        if (!errors || errors.length === 0) {
          logger.info({
            message: 'GraphQL Query',
            response: {
              statusCode,
              cacheControl: requestContext?.response?.http?.headers.get('cache-control'),
            },
            durationMs: Math.round(elapsedMilliseconds),
            request: {
              referrer: requestContext?.request?.http?.headers.get('referrer'),
              userAgent: requestContext?.request?.http?.headers.get('user-agent'),
              operationName: requestContext?.operationName,
              variables: requestContext?.request?.variables,
            },
            playgroundLink: `${config.origin}/graphql?query=${encodeURIComponent(
              requestContext?.request?.query ?? '',
            )}`,
          });
          return;
        }

        const firstMessage = errors[0]?.message;
        if (firstMessage?.includes('The user aborted a request')) {
          // This is a common error when the user navigates away or cancels the request.
          // We don't want to log this as an error.
          return;
        }

        // Check if this is a 404 error - these are often expected and should be warnings
        const is404Error = errors.some(
          (error) =>
            error.message?.includes('404: Not Found') ||
            error.message?.includes('404') ||
            (error.extensions?.http as { status?: number })?.status === 404,
        );

        // An upstream timeout (our pool timeout) is an operational event worth
        // surfacing
        const isUpstreamTimeout = errors.some(
          (error) => (error.extensions as { poolTimeout?: boolean })?.poolTimeout === true,
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
          response: {
            statusCode,
            cacheControl: requestContext?.response?.http?.headers.get('cache-control'),
          },
          durationMs: Math.round(elapsedMilliseconds),
          request: {
            referrer: requestContext?.request?.http?.headers.get('referrer'),
            userAgent: requestContext?.request?.http?.headers.get('user-agent'),
            operationName: requestContext?.operationName,
            variables: requestContext?.request?.variables,
          },
          errors,
          playgroundLink: `${config.origin}/graphql?query=${encodeURIComponent(requestContext?.request?.query ?? '')}`,
        });
      },
    };
  },
};

export default loggingPlugin;
