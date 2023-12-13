import hash from 'object-hash';
import { useLoaderData } from 'react-router-dom';

const MAX_GET_LENGTH = 1000;

type LoadOptions<TVariabels> = {
  endpoint: string;
  signal: AbortSignal;
  variables: TVariabels;
  locale: string;
  query: string;
};

export async function loadGraphQL<TVariabels>(options: LoadOptions<TVariabels>) {
  const { endpoint, signal, variables, locale, query } = options;

  const queryString = createQueryStringForGetRequest(query, options.variables);

  return fetch(`${endpoint}?${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      locale: locale,
    },
    signal,
  }).then(async (response) => {
    const body = await response.json();

    // If the server responded does not respond with unknownQueryId: true or unknownVariablesId: true, we can safely return the response
    if (body.unknownQueryId !== true && body.unknownVariablesId !== true) {
      // The json method can not be called twice on the same response object as the body stream is already consumed.
      // To prevent this error we override the json method to return the body object that has allready been parsed.
      // This is a bit of a hack, but it is more performant than calling response.clone() and then calling response.json() on the clone.
      response.json = async () => body;

      return response;
    }

    // Otherwise, we need to do a POST request to the GraphQL endpoint
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

function createQueryStringForGetRequest(query: string, variables: unknown) {
  const queryId = hash(query);

  const queryParams: Record<string, string> = {
    strict: 'true',
    queryId,
  };

  const variablesTooLongForGET =
    variables && encodeURIComponent(JSON.stringify(variables)).length > MAX_GET_LENGTH;
  // this is a bit silly. why serialize and then hash the object. would be cheaper to simply hash the serialized
  if (variablesTooLongForGET) {
    queryParams.variablesId = hash(JSON.parse(JSON.stringify(variables))); // it feels insane having to stringify and then parse again, but the  hash function cannot handle when multiple parts ot object reference the same object. E.g. no reuse. See https://github.com/puleos/object-hash/issues/78
  } else {
    queryParams.variables = JSON.stringify(variables);
  }

  return new URLSearchParams(queryParams).toString();
}
