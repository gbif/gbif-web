import React from 'react';

class NetworkError extends Error {
  name = 'NetworkError';
}

type Options = {
  endpoint?: string;
  throwNetworkErrors?: boolean;
  throwAllErrors?: boolean;
  lazyLoad?: boolean;
  keepDataWhileLoading?: boolean;
};

const defaultOptions: Options = {
  throwNetworkErrors: false,
  throwAllErrors: false,
  lazyLoad: false,
  keepDataWhileLoading: false,
};

export function useFetchGet<TResult>(options: Options = defaultOptions) {
  const [data, setData] = React.useState<TResult | undefined>();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | undefined>();
  const [abortController, setAbortController] = React.useState<AbortController | undefined>();

  // Cancel pending request on unmount
  const cancelRequest = React.useCallback(() => abortController?.abort(), [abortController]);
  React.useEffect(() => () => cancelRequest(), [cancelRequest]);

  // Just to make sure the names of the options don't collide
  const outerOptions = options;

  const load = React.useCallback(
    async (options?: Options) => {
      const _abortController = new AbortController();
      setAbortController(_abortController);

      if (options?.keepDataWhileLoading !== true) setData(undefined);
      setLoading(true);
      setError(undefined);

      const endpoint = outerOptions?.endpoint ?? options?.endpoint;
      if (typeof endpoint !== 'string')
        return console.error('No endpoint provided in the useFetchGet hook');

      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          signal: _abortController.signal,
        });

        if (!response.ok) throw new NetworkError(`Network error: ${response.statusText}`);

        const json = await response.json();
        setData(json);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          setError(undefined); // Ignore abort errors
        } else {
          setError(err as Error);
          setData(undefined);
        }
      } finally {
        setLoading(false);
        setAbortController(undefined);
      }
    },
    [outerOptions?.endpoint]
  );

  // Load data on mount and when options change.
  React.useEffect(() => {
    if (options.lazyLoad !== true) {
      load(options);
    }
  }, [load, options]);

  if (error instanceof NetworkError && options?.throwNetworkErrors) throw error;
  if (error instanceof Error && options?.throwAllErrors) throw error;

  return { data, loading, error, load, cancel: cancelRequest };
}

export default useFetchGet;
