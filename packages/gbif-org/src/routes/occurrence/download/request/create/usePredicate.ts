import { Setter } from '@/types';
import { strToHash } from '@/utils/hash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSearchParams } from 'react-router-dom';

type Result = {
  loading: boolean;
  error: string | undefined;
  predicate: string | undefined;
  setPredicate: Setter<string | undefined>;
  wasLoadedFromSession: boolean;
  discardSessionPredicate(): void;
};

export function usePredicate(): Result {
  const [searchParams] = useSearchParams();
  const { formatMessage } = useIntl();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [predicate, setPredicate] = useState<string | undefined>();
  const [wasLoadedFromSession, setWasLoadedFromSession] = useState(false);

  const originalPredicateRef = useRef<string | undefined>();
  const sessionStorageKeyRef = useRef<string>('download-predicate-default');

  useEffect(() => {
    // Abort the fetch request if dependencies change before it completes.
    const controller = new AbortController();

    const initialize = async () => {
      setLoading(true);
      setError(undefined);
      setWasLoadedFromSession(false);

      try {
        const original = await getOriginalPredicate(searchParams, controller.signal);

        originalPredicateRef.current = original;
        const key = original
          ? `download-predicate-${strToHash(original)}`
          : 'download-predicate-default';
        sessionStorageKeyRef.current = key;

        const storedPredicate = window.sessionStorage.getItem(key);

        // If a different version is in storage, load it and flag that a recovery happened.
        if (
          storedPredicate != null &&
          normalizeJSON(original ?? '') !== normalizeJSON(storedPredicate)
        ) {
          setWasLoadedFromSession(true);
          setPredicate(storedPredicate);
        } else {
          setPredicate(original);
        }
      } catch (e: any) {
        // An aborted fetch is an expected outcome, not an application error.
        if (e.name === 'AbortError') {
          return;
        }
        setError(
          e instanceof Error
            ? e.message
            : formatMessage({
                id: 'download.request.errors.unexpectedError',
                defaultMessage: 'An unexpected error occurred',
              })
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    initialize();

    return () => {
      controller.abort();
    };
  }, [searchParams, formatMessage]);

  useEffect(() => {
    // Avoid writing to storage during the initial load.
    if (loading) return;

    const key = sessionStorageKeyRef.current;
    if (predicate === undefined) {
      window.sessionStorage.removeItem(key);
    } else {
      // Keep storage clean: only store modified predicates, and remove if reverted to original.
      if (predicate === originalPredicateRef.current) {
        window.sessionStorage.removeItem(key);
      } else {
        window.sessionStorage.setItem(key, predicate);
      }
    }
  }, [predicate, loading]);

  const discardSessionPredicate = useCallback(() => {
    setPredicate(originalPredicateRef.current);
    // Clear the notification flag since the user has taken action.
    setWasLoadedFromSession(false);
  }, []);

  return {
    loading,
    error,
    predicate,
    setPredicate,
    wasLoadedFromSession,
    discardSessionPredicate,
  };
}

function normalizeJSON(json: string): string | null {
  try {
    return JSON.stringify(JSON.parse(json));
  } catch {
    return null;
  }
}

async function getPredicateFromGraphQL(
  variablesId: string,
  queryId: string,
  signal: AbortSignal
): Promise<string> {
  const endpoint =
    import.meta.env.PUBLIC_GRAPHQL_ENDPOINT + `?variablesId=${variablesId}&queryId=${queryId}`;

  const response = await fetch(endpoint, {
    headers: { 'Content-Type': 'application/json' },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch predicate: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  const predicate = result?.data?.occurrenceSearch?._meta?.predicate;

  if (!predicate) {
    throw new Error('No predicate found in GraphQL response.');
  }

  return JSON.stringify(predicate);
}

async function getOriginalPredicate(
  searchParams: URLSearchParams,
  signal: AbortSignal
): Promise<string | undefined> {
  const variablesId = searchParams.get('variablesId');
  const queryId = searchParams.get('queryId');

  if (variablesId && queryId) {
    return await getPredicateFromGraphQL(variablesId, queryId, signal);
  }

  return searchParams.get('predicate') ?? undefined;
}
