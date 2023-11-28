import { useLoaderData } from 'react-router-dom';

export function createGraphQLHelpers<TResult, TVariabels>(query: string) {
  const useTypedLoaderData = useLoaderData as () => { data: TResult };

  const operationName = getOperationNameFromQuery(query);
  if (typeof operationName !== 'string') {
    throw new Error(`Could not find operation name in query: ${query}`);
  }

  function load(options: { endpoint: string; request: Request; variables: TVariabels, locale: string }) {
    const { locale = 'en' } = options;
    return fetch(options.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'locale': locale
      },
      signal: options.request.signal,
      body: JSON.stringify({
        query,
        variables: options.variables,
        operationName,
      }),
    });
  }

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
