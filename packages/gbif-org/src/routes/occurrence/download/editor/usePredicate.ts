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
  const queryId = searchParams.get('queryId');

  if (variablesId && queryId) {
    return await getPredicateFromGraphQL(variablesId, queryId, signal);
  }

  return searchParams.get('predicate') ?? undefined;
}
