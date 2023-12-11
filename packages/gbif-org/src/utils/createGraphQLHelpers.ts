import { useLoaderData } from 'react-router-dom';

type LoadOptions<TVariabels> = {
  endpoint: string;
  signal: AbortSignal;
  variables: TVariabels;
  locale: string;
  query: string;
};

export function loadGraphQL<TVariabels>(options: LoadOptions<TVariabels>) {
  const { endpoint, signal, variables, locale, query } = options;

  const operationName = getOperationNameFromQuery(query);
  if (typeof operationName !== 'string') {
    throw new Error(`Could not find operation name in query: ${query}`);
  }

  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      locale: locale,
    },
    signal,
    body: JSON.stringify({
      query: query,
      variables: variables,
      operationName,
    }),
  });
}

export function createGraphQLHelpers<TResult, TVariabels>(query: string) {
  const useTypedLoaderData = useLoaderData as () => { data: TResult };

  const load = (options: Omit<LoadOptions<TVariabels>, 'query'>) =>
    loadGraphQL<TVariabels>({ ...options, query });

  return {
    load,
    useTypedLoaderData,
  };
}

function getOperationNameFromQuery(query: string): string | null {
  // This regex looks for the operation name pattern in the GraphQL query string.
  // It finds the word immediately following the 'query' keyword.
  const operationNameMatch = /^\s*query\s+(\w+)/.exec(query);
  // If a match is found, return the first group (the operation name).
  // Otherwise, return null.
  return operationNameMatch ? operationNameMatch[1] : null;
}
