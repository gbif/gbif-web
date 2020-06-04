import hash from 'object-hash';
import axios from 'axios';
import { QueryError } from './QueryError';
import env from './.env.json';

let CancelToken = axios.CancelToken;

// const graphqlEndpoint = 'http://labs.gbif.org:7022/graphql';
const graphqlEndpoint = 'http://localhost:4003/graphql';
// const graphqlEndpoint = 'http://localhost:4000/graphql';
const maxGETLength = 1000;

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

function query(query, { variables }) {
  // errorPolicy = none | all
  // none: meaning that no errors are tolerated
  // all: if there are any data, then return it
  const queryId = hash(query);

  const queryParams = { queryId };
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