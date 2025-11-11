import hash from 'object-hash';
import axios from 'axios';
import { QueryError } from './QueryError';
import Queue from "queue-promise";

const queues = {};

let CancelToken = axios.CancelToken;
const maxGETLength = 1000;

function query(query, { variables, client }, {name: queueName, concurrent = 1, interval = 0} = {}) {
  const graphqlEndpoint = client?.endpoint;
  const headers = client?.headers;
  const queryId = hash(query);
  const queryParams = { queryId, strict: true };
  const variablesTooLongForGET = variables && encodeURIComponent(JSON.stringify(variables)).length > maxGETLength;
  // this is a bit silly. why serialize and then hash the object. would be cheaper to simply hash the serialized
  if (variablesTooLongForGET) {
    queryParams.variablesId = hash(JSON.parse(JSON.stringify(variables))); // it feels insane having to stringify and then parse again, but the  hash function cannot handle when multiple parts ot object reference the same object. E.g. no reuse. See https://github.com/puleos/object-hash/issues/78
  } else {
    queryParams.variables = JSON.stringify(variables);
  }

  let cancel;
  return {
    promise: new Promise((resolve, reject) => {
      const cancelToken = new CancelToken(function executor(c) { cancel = c; });
      const startRequest = () => axios.get(graphqlEndpoint, {
        params: queryParams,
        headers,
        cancelToken
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
       if (!queueName) {
        startRequest();
       } else {
        if (!queues[queueName]) {
          queues[queueName] = new Queue({
            concurrent,
            interval,
            start: true
          });
        }
        queues[queueName].enqueue(startRequest);
       }
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