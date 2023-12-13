import { loadGraphQL } from '@/utils/createGraphQLHelpers';
import { useConfig } from '@/contexts/config';
import { useI18n } from '@/contexts/i18n';
import React from 'react';
import Queue from 'queue-promise';

class NetworkError extends Error {
  name = 'NetworkError';
}

type Options<TVariabels> = {
  throwNetworkErrors?: boolean;
  throwAllErrors?: boolean;
  variables?: TVariabels;
  ignoreVariableUpdates?: boolean;
  lazyLoad?: boolean;
  keepDataWhileLoading?: boolean;
  queue?: {
    name?: string;
    concurrent?: number;
    interval?: number;
  };
};

const defaultOptions: Options<unknown> = {
  throwNetworkErrors: false,
  throwAllErrors: false,
  variables: undefined,
  ignoreVariableUpdates: false,
  lazyLoad: false,
  keepDataWhileLoading: false,
  queue: {
    name: undefined,
    concurrent: 1,
    interval: 0,
  },
};

const queues: Record<string, Queue> = {};

export function useQuery<TResult, TVariabels>(
  query: string,
  options: Options<TVariabels> = defaultOptions as Options<TVariabels>
) {
  const [data, setData] = React.useState<TResult | undefined>();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | undefined>();
  const [abortController, setAbortController] = React.useState<AbortController | undefined>();
  const config = useConfig();
  const { locale } = useI18n();

  // Cancel pending request on unmount
  const cancelRequest = React.useCallback(() => abortController?.abort?.(), [abortController]);
  React.useEffect(() => () => cancelRequest(), [cancelRequest]);

  const load = React.useCallback(
    (options: Options<TVariabels>) => {
      // Create a function that will start the request. This function will be called by the queueing logic
      const startRequest = async () => {
        const _abortController = new AbortController();
        setAbortController(_abortController);

        if (options.keepDataWhileLoading !== true) setData(undefined);
        setLoading(true);
        setError(undefined);

        const response = loadGraphQL({
          signal: _abortController.signal,
          endpoint: config.graphqlEndpoint,
          query: query,
          variables: options.variables,
          locale: locale.cmsLocale ?? locale.code,
        });

        return response
          .then(async (response) => {
            // Handle error response errors from the server
            if (response.ok === false) {
              setError(new Error(response.statusText));
              setData(undefined);
            }

            // Handle successful response
            else {
              const result = (await response.json()) as { data: TResult };
              setError(undefined);
              setData(result.data);
            }
          })
          .catch((error) => {
            // Handle cancellation errors
            if (error instanceof Error && error.name === 'AbortError') {
              setError(undefined);
            }

            // Handle network errors
            else if (error instanceof Error && error.name === 'TypeError') {
              setError(new NetworkError(error.message));
              setData(undefined);
            }

            // Handle other errors
            else {
              setError(error);
              setData(undefined);
            }
          })
          .finally(() => {
            setAbortController(undefined);
            setLoading(false);
          });
      };

      // If a queue name is not provided, start the request immediately
      if (typeof options.queue?.name !== 'string') {
        return startRequest();
      }

      // If there is no queue for the given name, create one
      if (queues[options.queue.name] === undefined) {
        queues[options.queue.name] = new Queue({
          concurrent: options.queue.concurrent,
          interval: options.queue.interval,
          start: true,
        });
      }

      // Add the request to the queue
      queues[options.queue.name].enqueue(startRequest);
    },
    [config.graphqlEndpoint, locale.cmsLocale, locale.code, query]
  );

  // Prevent a change in variable to trigger a reload if ignoreVariableUpdates has been enabled
  const optionsDependency = React.useMemo(() => {
    return JSON.stringify({
      ...options,
      variables: options.ignoreVariableUpdates === true ? undefined : options.variables,
    });
  }, [options]);

  // Load the data on mount and when the options change
  React.useEffect(() => {
    if (options.lazyLoad !== true) {
      load(options);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load, query, optionsDependency]);

  // Throw errors if enabled
  if (error instanceof NetworkError && options?.throwNetworkErrors) throw error;
  if (error instanceof Error && options?.throwAllErrors) throw error;

  return { data, loading, error, load, cancel: cancelRequest };
}

export default useQuery;
