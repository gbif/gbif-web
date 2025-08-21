import { useConfig } from '@/config/config';
import { useI18n } from '@/reactRouterPlugins';
import { usePartialDataNotification } from '@/routes/rootErrorPage';
import { GraphQLService } from '@/services/graphQLService';
import isArray from 'lodash/isArray';
import Queue from 'queue-promise';
import React, { useRef } from 'react';

type Options<TVariabels> = {
  throwNetworkErrors?: boolean;
  throwAllErrors?: boolean;
  variables?: TVariabels;
  ignoreVariableUpdates?: boolean;
  lazyLoad?: boolean;
  keepDataWhileLoading?: boolean;
  notifyOnErrors?: string | boolean;
  queue?: {
    name?: string;
    concurrent?: number;
    interval?: number;
  };
  // Some pages use lazyLoad for more fine-grained control over when the query is executed, but still executes the query immediately.
  // This puts the page in a state where it is not loading, but also does not have any data. This can mess with the scroll restoration, as we can't scroll to a point that does not exist.
  // Use this option to force a loading state from the beginning
  forceLoadingTrueOnMount?: boolean;
};

const defaultOptions: Options<unknown> = {
  throwNetworkErrors: false,
  throwAllErrors: false,
  variables: undefined,
  ignoreVariableUpdates: false,
  lazyLoad: false,
  keepDataWhileLoading: false,
  notifyOnErrors: false,
  queue: {
    name: undefined,
    concurrent: 1,
    interval: 0,
  },
  forceLoadingTrueOnMount: false,
};

const queues: Record<string, Queue> = {};

const ABORT_REASON = 'REQUEST_ABORTED_ON_PURPOSE';

export function useQuery<TResult, TVariabels>(
  query: string,
  options: Options<TVariabels> = defaultOptions as Options<TVariabels>
) {
  const notifyOfPartialData = usePartialDataNotification();
  const isMounted = useRef(false);
  const randomTokenRef = useRef(getRandomToken());
  const [data, setData] = React.useState<TResult | undefined>();
  const [loading, setLoading] = React.useState(options.forceLoadingTrueOnMount ?? false);
  const [error, setError] = React.useState<QueryError | undefined>();
  const cancelRequestRef = useRef<(reason: string) => void>(() => () => {});
  const config = useConfig();
  const { locale } = useI18n();

  // Cancel pending request on unmount
  React.useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      cancelRequestRef.current(ABORT_REASON);
    };
  }, []);

  React.useEffect(() => {
    if (error && options.notifyOnErrors) {
      notifyOfPartialData();
      console.error('Error in useQuery:', error);
    }
  }, [error, notifyOfPartialData, options.notifyOnErrors]);

  // Prevent a change in variable to trigger a reload if ignoreVariableUpdates has been enabled
  const optionsDependency = React.useMemo(() => {
    return JSON.stringify({
      ...options,
      variables: options.ignoreVariableUpdates === true ? undefined : options.variables,
    });
  }, [options]);

  const load = React.useCallback(
    (loadOptions?: Options<TVariabels>, context?: { authorization?: string }) => {
      const mergedOptions = { ...options, ...(loadOptions ?? {}) };

      // Create a function that will start the request. This function will be called by the queueing logic
      const startRequest = async () => {
        if (isMounted.current === false) return;
        if (mergedOptions?.keepDataWhileLoading !== true) setData(undefined);
        setLoading(true);
        setError(undefined);
        cancelRequestRef.current(ABORT_REASON);

        const abortController = new AbortController();
        // Update the ref to the new cancel function
        cancelRequestRef.current = (reason: string) => {
          abortController.abort(reason);
        };

        const graphqlService = new GraphQLService({
          endpoint: config.graphqlEndpoint,
          locale: locale.cmsLocale || locale.code,
          abortSignal: abortController.signal,
          authorization: context?.authorization || undefined,
        });

        return graphqlService
          .query<TResult, TVariabels>(query, mergedOptions?.variables as TVariabels)
          .then(async (response) => {
            // Handle error response errors from the server
            if (response.ok === false) {
              const data = await response.json();
              if (data.errors) {
                setError(formatErrors(data.errors, query, mergedOptions?.variables as object));
              } else {
                setError(
                  new QueryError({
                    query: query,
                    variables: mergedOptions?.variables as object,
                    error: new Error(`${response?.status} ${response.statusText}`),
                  })
                );
              }
              setData(undefined);
            }

            // Handle successful response
            else {
              const result = await response.json();
              if (result.errors) {
                const error = formatErrors(
                  result.errors,
                  query,
                  mergedOptions?.variables as object
                );
                setError(error);
              }
              setData(result.data);
              setLoading(false);
            }
          })
          .catch((error) => {
            // Handle cancellation errors
            setData(undefined);
            setLoading(false);
            if ((error instanceof Error && error.name === 'AbortError') || error === ABORT_REASON) {
              // setError(canceledResponse(error));
              setError(undefined);
              return;
            }
            // Handle network errors
            setError(
              new QueryError({
                error,
                query: query,
                variables: mergedOptions?.variables as object,
              })
            );
          });
      };

      // cancel any ongoing requests before starting a new one
      cancelRequestRef.current(ABORT_REASON);

      // If a queue name is not provided, start the request immediately
      if (typeof mergedOptions?.queue?.name !== 'string') {
        return startRequest();
      }

      // If there is no queue for the given name, create one
      if (queues[mergedOptions?.queue?.name] === undefined) {
        queues[mergedOptions.queue.name] = new Queue({
          concurrent: mergedOptions.queue.concurrent ?? 1,
          interval: mergedOptions.queue.interval ?? 0,
          start: true,
        });
      }
      const randomToken = getRandomToken();
      randomTokenRef.current = randomToken;

      // Add the request to the queue
      queues[mergedOptions.queue.name].enqueue(async () => {
        if (isMounted.current === false) return; // if unmounted then ignore
        if (randomTokenRef.current !== randomToken) return; // if stale ignore - this is necessary because we cannot cancel a request before it starts. So we need to check at tome of starting if the request has since changed
        return startRequest();
      });
    },
    [config.graphqlEndpoint, locale.cmsLocale, locale.code, query, optionsDependency]
  );

  // Load the data on mount and when the options change
  React.useEffect(() => {
    if (options.lazyLoad !== true) {
      load(options);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load, query, optionsDependency]);

  // Throw errors if enabled
  if (error?.error && options?.throwNetworkErrors) throw error.error;
  if (error && options?.throwAllErrors) throw error;

  const cancelRequest = React.useCallback((reason: string) => cancelRequestRef.current(reason), []);
  return { data, loading, error, load, cancel: cancelRequest };
}

export default useQuery;

function getRandomToken() {
  return Math.random();
}

function formatErrors(
  errors: Array<{ message?: string; path?: string[] }>,
  query: string,
  variables: object
): QueryError {
  // Ensure each error has a defined message and path
  const formattedErrors = errors.map((e) => ({
    message: e.message ?? 'Error message not found.',
    path: e.path ?? [],
  }));
  return new QueryError({ graphQLErrors: formattedErrors, query, variables });
}

// function canceledResponse(reason) {
//   return new QueryError({
//     message: 'Canceled',
//     isCanceled: true,
//   });
// }

export class QueryError extends Error {
  graphQLErrors?: Array<{ message?: string; path?: string[] }>;
  error?: Error;
  isCanceled: boolean;
  query?: string;
  variables?: object;

  constructor({
    message,
    graphQLErrors,
    error,
    isCanceled,
    query,
    variables,
  }: {
    message?: string;
    graphQLErrors?: Array<{ message?: string; path?: string[] }>;
    error?: Error;
    isCanceled?: boolean;
    query?: string;
    variables?: object;
  }) {
    super(message);
    this.graphQLErrors = graphQLErrors || [];
    this.error = error;
    this.isCanceled = isCanceled || false;
    this.query = query;
    this.variables = variables;

    // Generate an error message based on errors if no explicit message is provided
    const generateErrorMessage = (err: QueryError) => {
      let message = '';
      // If we have GraphQL errors present, add that to the error message.
      if (isArray(err?.graphQLErrors)) {
        err?.graphQLErrors?.forEach((graphQLError?: { message?: string }) => {
          const errorMessage = graphQLError?.message
            ? graphQLError.message
            : 'Error message not found.';
          message += `${errorMessage}\n`;
        });
      }

      if (err?.error) {
        message += 'Network error: ' + err?.error?.message + '\n';
      }

      // strip newline from the end of the message
      message = message.replace(/\n$/, ' ');
      return message;
    };

    this.message = message ? message : generateErrorMessage(this);
  }
}
