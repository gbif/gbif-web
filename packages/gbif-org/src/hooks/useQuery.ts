import { useConfig } from '@/contexts/config/config';
import { useI18n } from '@/contexts/i18n';
import React from 'react';
import Queue from 'queue-promise';
import { GraphQLService } from '@/services/graphQLService';

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
  // const [abortController, setAbortController] = React.useState<AbortController | undefined>();
  const [cancelRequest, setCancel] = React.useState<(reason?: string) => void>(() => () => {});
  const config = useConfig();
  const { locale } = useI18n();

  // Cancel pending request on unmount
  // const cancelRequest = React.useCallback((reason: string) => abortController?.abort?.(reason), [abortController]);
  React.useEffect(() => {
    return () => {
      cancelRequest('Cancel request');
    };
  }, [cancelRequest]);

  const load = (loadOptions?: Options<TVariabels>) => {
    const mergedOptions = { ...options, ...(loadOptions ?? {}) };

    if (mergedOptions?.keepDataWhileLoading !== true) setData(undefined);
    setLoading(true);
    setError(undefined);
    // console.log('abortController', !!abortController);
    // abortController?.abort?.('RENEW_REQUEST');
    console.log('cancel request before starting new request');
    cancelRequest('RENEW_REQUEST');

    const _abortController = new AbortController();
    // setAbortController(_abortController);
    setCancel(() => () => {
      console.log('cancel request called in next line');
      _abortController.abort('Cancel request');
    });

    console.log('start new request');
    const graphqlService = new GraphQLService({
      endpoint: config.graphqlEndpoint,
      locale: locale.cmsLocale || locale.code,
      abortSignal: _abortController.signal,
    });

    return graphqlService
      .query<TResult, TVariabels>(query, mergedOptions?.variables as TVariabels)
      .then(async (response) => {
        // Handle error response errors from the server
        if (response.ok === false) {
          console.log('not ok, remove data');
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
        console.log('failed request, catch error', error);
        console.log(error.name);
        // Handle cancellation errors
        if (error instanceof Error && error.name === 'AbortError') {
          // setError(undefined);
          console.log('abort error');
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
      })
      .finally(() => {
        // console.log('finally');
        // setAbortController(undefined);
        // setLoading(false);
      });
  };

  // const load = React.useCallback(
  //   (loadOptions?: Options<TVariabels>) => {
  //     const mergedOptions = { ...options, ...(loadOptions ?? {}) };

  //     // Create a function that will start the request. This function will be called by the queueing logic
  //     const startRequest = () => {
  //       if (mergedOptions?.keepDataWhileLoading !== true) setData(undefined);
  //       setLoading(true);
  //       setError(undefined);
  //       // console.log('abortController', !!abortController);
  //       // abortController?.abort?.('RENEW_REQUEST');
  //       console.log('cancel request before starting new request');
  //       cancelRequest('RENEW_REQUEST');

  //       const _abortController = new AbortController();
  //       // setAbortController(_abortController);
  //       setCancel(() => () => {
  //         console.log('cancel request called in next line');
  //         _abortController.abort('Cancel request');
  //       });

  //       console.log('start new request');
  //       const graphqlService = new GraphQLService({
  //         endpoint: config.graphqlEndpoint,
  //         locale: locale.cmsLocale || locale.code,
  //         abortSignal: _abortController.signal,
  //       });

  //       return graphqlService
  //         .query<TResult, TVariabels>(query, mergedOptions?.variables as TVariabels)
  //         .then(async (response) => {
  //           // Handle error response errors from the server
  //           if (response.ok === false) {
  //             console.log('not ok, remove data');
  //             setError(new Error(response.statusText));
  //             setData(undefined);
  //           }

  //           // Handle successful response
  //           else {
  //             const result = await response.json();
  //             setError(undefined);
  //             setData(result.data);
  //             setLoading(false);
  //           }
  //         })
  //         .catch((error) => {
  //           console.log('failed request, catch error', error);
  //           console.log(error.name);
  //           // Handle cancellation errors
  //           if (error instanceof Error && error.name === 'AbortError') {
  //             // setError(undefined);
  //             console.log('abort error');
  //             return;
  //           }

  //           // Handle network errors
  //           else if (error instanceof Error && error.name === 'TypeError') {
  //             setError(new NetworkError(error.message));
  //             setData(undefined);
  //             setLoading(false);
  //           }

  //           // Handle other errors
  //           else {
  //             setError(error);
  //             setData(undefined);
  //             setLoading(false);
  //           }
  //         })
  //         .finally(() => {
  //           // console.log('finally');
  //           // setAbortController(undefined);
  //           // setLoading(false);
  //         });
  //     };

  //     // If a queue name is not provided, start the request immediately
  //     // if (typeof mergedOptions?.queue?.name !== 'string') {
  //     startRequest();
  //     // }

  //     // If there is no queue for the given name, create one
  //     // if (queues[mergedOptions.queue.name] === undefined) {
  //     //   queues[mergedOptions.queue.name] = new Queue({
  //     //     concurrent: mergedOptions.queue.concurrent ?? 1,
  //     //     interval: mergedOptions.queue.interval ?? 0,
  //     //     start: true,
  //     //   });
  //     // }

  //     // Add the request to the queue
  //     // queues[mergedOptions.queue.name].enqueue(startRequest);
  //   },
  //   [config.graphqlEndpoint, locale.cmsLocale, locale.code, query, cancelRequest]
  // );

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
