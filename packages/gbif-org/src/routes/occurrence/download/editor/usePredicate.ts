const query = `query($predicate: Predicate){
  occurrenceSearch(predicate: $predicate, size: 0) {
    _meta
  }
}`;

async function getPredicateFromGraphQL(variablesId: string, signal: AbortSignal): Promise<string> {
  const endpoint =
    import.meta.env.PUBLIC_GRAPHQL_ENDPOINT +
    `?variablesId=${variablesId}&query=${encodeURIComponent(query)}`;

  const response = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      ...(typeof window !== 'undefined' ? { 'x-gbif-site-url': window.location.href } : {}),
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch predicate: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  const predicate = result?.data?.occurrenceSearch?._meta?.normalizedPredicate?.predicate;

  if (!predicate) {
    throw new Error('No predicate found in GraphQL response.');
  }

  return JSON.stringify(predicate, null, 2);
}

export async function getOriginalPredicate(
  searchParams: URLSearchParams,
  signal: AbortSignal
): Promise<string | undefined> {
  const variablesId = searchParams.get('variablesId');

  if (variablesId) {
    return await getPredicateFromGraphQL(variablesId, signal);
  }

  return searchParams.get('predicate') ?? undefined;
}

// Reads and clears window.__INITIAL_PREDICATE__, which gbif/server.js inlines into the page
// when */download/request is hit via a POST form submission (external sites use this instead
// of a URL param since predicates can be far larger than a URL can carry). It's only present
// on the response that rendered it, so it's consumed at most once per page load.
export function consumeInitialPredicate(): string | undefined {
  if (typeof window === 'undefined') return undefined;

  const predicate = window.__INITIAL_PREDICATE__;
  window.__INITIAL_PREDICATE__ = undefined;

  if (typeof predicate !== 'string' || predicate.trim() === '') return undefined;

  try {
    return JSON.stringify(JSON.parse(predicate), null, 2);
  } catch (e) {
    return predicate;
  }
}
