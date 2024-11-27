import { useConfig } from '@/config/config';
import { useI18n } from '@/reactRouterPlugins';
import React, { useRef } from 'react';
import Queue from 'queue-promise';
import { GraphQLService } from '@/services/graphQLService';

export class NetworkError extends Error {
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

const ABORT_REASON = 'REQUEST_ABORTED_ON_PURPOSE';

export function useQuery<TResult, TVariabels>(
  query: string,
  options: Options<TVariabels> = defaultOptions as Options<TVariabels>
) {
  const isMounted = useRef(false);
  const randomTokenRef = useRef(getRandomToken());
  const [data, setData] = React.useState<TResult | undefined>();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | undefined>();
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

  // Prevent a change in variable to trigger a reload if ignoreVariableUpdates has been enabled
  const optionsDependency = React.useMemo(() => {
    return JSON.stringify({
      ...options,
      variables: options.ignoreVariableUpdates === true ? undefined : options.variables,
    });
  }, [options]);

  const load = React.useCallback(
    (loadOptions?: Options<TVariabels>) => {
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
        });

        return graphqlService
          .query<TResult, TVariabels>(query, mergedOptions?.variables as TVariabels)
          .then(async (response) => {
            // Handle error response errors from the server
            if (response.ok === false) {
              setError(new Error(response.statusText));
              setData(undefined);
            }

            // Handle successful response
            else {
              const result = await response.json();
              setError(undefined);
              setData(result.data);
              setLoading(false);
            }
          })
          .catch((error) => {
            // Handle cancellation errors
            if ((error instanceof Error && error.name === 'AbortError') || error === ABORT_REASON) {
              // setError(undefined);
              return;
            }

            // Handle network errors
            else if (error instanceof Error && error.name === 'TypeError') {
              setError(new NetworkError(error.message));
              setData(undefined);
              setLoading(false);
            }

            // Handle other errors
            else {
              setError(error);
              setData(undefined);
              setLoading(false);
            }
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
  if (error instanceof NetworkError && options?.throwNetworkErrors) throw error;
  if (error instanceof Error && options?.throwAllErrors) throw error;

  const cancelRequest = React.useCallback((reason: string) => cancelRequestRef.current(reason), []);
  return { data, loading, error, load, cancel: cancelRequest };
}

export default useQuery;

function getRandomToken() {
  return Math.random();
}
