import hash from 'object-hash';
import axios from 'axios';
import { QueryError } from './QueryError';

let CancelToken = axios.CancelToken;
const maxGETLength = 1000;

function query(query, { variables, client }) {
  const graphqlEndpoint = client?.endpoint;
  const headers = client?.headers;
  const queryId = hash(query);
  const queryParams = { queryId, strict: true };
  const variablesTooLongForGET = variables && encodeURIComponent(JSON.stringify(variables)).length > maxGETLength;
  // this is a bit silly. why serialize and then hash the object. would be cheaper to simply hash the serialized
  if (variablesTooLongForGET) {
    queryParams.variablesId = hash(variables);
  } else {
    queryParams.variables = variables;
  }

  let cancel;
  return {
    promise: new Promise((resolve, reject) => {
      axios.get(graphqlEndpoint, {
        params: queryParams,
        headers,
        cancelToken: new CancelToken(function executor(c) { cancel = c; })
      })
        .then(response => resolve(formatResponse(response.data)))
        .catch(error => {
          const unknownQueryId = error?.response?.data?.unknownQueryId;
          const unknownVariablesId = error?.response?.data?.unknownVariablesId;
          if (axios.isCancel(error)) {
            resolve(canceledResponse(error.message));
          } else if (unknownQueryId || unknownVariablesId) {
            axios.post(graphqlEndpoint, { query, variables },
              {
                headers,
                cancelToken: new CancelToken(function executor(c) { cancel = c; })
              })
              .then(response => resolve(formatResponse(response.data)))
              .catch(innerError => {
                if (axios.isCancel(innerError)) {
                  resolve(canceledResponse(innerError.message));
                } else {
                  resolve(netWorkErrorResponse(innerError));
                }
              })
          } else {
            resolve(netWorkErrorResponse(error));
          }
        })
    }),
    cancel: reason => cancel(reason || 'CANCELED')
  }
}

function formatResponse(response) {
  let { data, errors } = response;
  return {
    data,
    error: errors ? new QueryError({ graphQLErrors: errors }) : void 0
  };
}

function netWorkErrorResponse(err) {
  return {
    data: undefined,
    error: new QueryError({
      networkError: {
        message: err?.response?.statusText || 'Network error',
        statusCode: err?.response?.status,
        data: err?.response?.data,
      }
    })
  }
}

function canceledResponse(reason) {
  return {
    data: null,
    error: new QueryError({
      message: 'Canceled',
      isCanceled: {
        message: reason
      }
    })
  };
}

export default query;

// const graphqlQuery = `
// query fetch($limit: Int){
//   datasetSearch(limit: $limit) {
//     results {
//       title
//     }
//   }
// }
// `;

// const { promise: dataPromise, cancel } = query(graphqlQuery, { variables: { limit: 2, otherValues: '23945876239487562938475692873456982u3ihrgejwfo87324wytuiregfhkjso87q34wtiyruegfshjdo9w78iuerhsfw948iuershdfw98eruishgdfkjwoeiruysghfdkw98iuershgkfdweirsulgfdhksiulfdkghj' } });

// setTimeout(() => cancel(), 500);
// dataPromise
//   .then(x => console.log('success', JSON.stringify(x, null, 2)))
//   .catch(x => console.log('error returned', x));