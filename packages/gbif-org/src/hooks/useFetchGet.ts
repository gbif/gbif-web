import { hash } from '@/utils/hash';
import { useCallback, useEffect, useRef, useState } from 'react';

type Options = {
  endpoint?: string;
  throwAllErrors?: boolean;
  lazyLoad?: boolean;
  keepDataWhileLoading?: boolean;
  headers?: Record<string, string>;
};

const defaultOptions: Options = {
  throwAllErrors: false,
  lazyLoad: false,
  keepDataWhileLoading: false,
  headers: {},
};

const ABORT_REASON = 'REQUEST_ABORTED_ON_PURPOSE';

export function useFetchGet<TResult>(options: Options = defaultOptions) {
  const isMounted = useRef(false);
  const [data, setData] = useState<TResult | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>();
  const cancelRequestRef = useRef<(reason: string) => void>(() => () => {});
  const hashOptions = hash(options);

  // Cancel pending request on unmount
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      cancelRequestRef.current(ABORT_REASON);
    };
  }, []);

  const load = useCallback(
    (loadOptions?: Options) => {
      const mergedOptions = { ...options, ...(loadOptions ?? {}) };

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

        try {
          const response = await fetch(mergedOptions.endpoint!, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              ...mergedOptions?.headers,
            },
            signal: abortController.signal,
          });

          // Handle HTTP errors
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
          }

          const result = await response.json();

          if (isMounted.current) {
            setData(result);
            setError(undefined);
            setLoading(false);
          }
        } catch (error) {
          // Handle cancellation errors
          if ((error instanceof Error && error.name === 'AbortError') || error === ABORT_REASON) {
            return;
          }

          // Handle network errors
          if (error instanceof TypeError) {
            const networkError = new Error(error.message);
            if (isMounted.current) {
              setError(networkError);
              setData(undefined);
              setLoading(false);
            }
          } else {
            // Handle other errors
            if (isMounted.current) {
              setError(error instanceof Error ? error : new Error(String(error)));
              setData(undefined);
              setLoading(false);
            }
          }
        }
      };

      // Cancel any ongoing requests before starting a new one
      cancelRequestRef.current(ABORT_REASON);

      return startRequest();
    },
    [hashOptions]
  );

  // Load the data on mount and when the options change
  useEffect(() => {
    if (options.lazyLoad !== true) {
      load(options);
    }
  }, [load, hashOptions]);

  // Throw errors if enabled
  if (error instanceof Error && options?.throwAllErrors) throw error;

  const cancelRequest = useCallback((reason: string) => cancelRequestRef.current(reason), []);

  return { data, loading, error, load, cancel: cancelRequest };
}

export default useFetchGet;
