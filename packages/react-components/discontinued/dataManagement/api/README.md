# Graphql data
The main API is GraphQL. A UI is available at http://labs.gbif.org:7022/graphql

To ease usage, there is a client so you only have to configure once, a context provider and a `useQuery` hook that manage cancelation and injecting data into components.

## ApiClient
The client has the benefit that it use GET and persistent IDs for queries and variables. In most cases that mean that far less data is being sent from the client to the server.

```
const client = new ApiClient({
  gql: {
    endpoint: 'http://labs.gbif.org:7022/graphql'
    headers: {}
    },
});

const GET_DATASETS = `
  query datasets($limit: Int=3){
    datasetSearch(limit: $limit) {
      results {
        key
        title
      }
    }
  }
`

const variables = { limit: 10 };

const {promise, cancel} = client.query({query, variables});
promise.then(response => {
  const { data, error } = response;
})
```

`cancel(message)` will add a isCanceled field to the error object, with the message.

## ApiContext
```
<ApiContext.Provider value={client}>
  {/* hooks can be used here */}
</ApiContext.Provider>
```

## useQuery

```
const GET_DATASETS = `
  query datasets($limit: Int=3){
    datasetSearch(limit: $limit) {
      results {
        key
        title
      }
    }
  }
`

function MyComponent() {
  const { data, loading, error, load, cancel } = useQuery(GET_DATASETS);
}
```

The signature is `useQuery(query, [options])`
* query: a required graphql query document
* options: variables and configuration. see below

options
* variables: What variables to use in the query
* ignoreVariableUpdates: do not fetch data anew just because variables are updated
* lazyLoad: do not load data on mount, but wait until explicitly called using `load`
* client: if no context provided or you want to override it, then you can provide a ApiClient

returns
* data: object with the data from graphql
* loading: boolean
* error: object with errors
* load: load data with new variables
* cancel: cancel the ongoing request
