/*
a query object api
that simply return a data promise

From that we could build:

withGraphQL hook
requires a configured context i suppose

and a higherOrderComponent
*/

/*
The query API simply takes query, variables (anything else that graphql takes)
and performs the GET and fallback to POST for large variables and unseen queries
*/