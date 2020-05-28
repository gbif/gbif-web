# A wrapper the Elastic Search literature API

It has a GET API, similar to our other APIs as well as a post API that use the predicate structure from our occurrence download API. But there are differences. most notably in the response format.

## Differences in GET
The GET api is extended to allow for `not` and `isNotNull`. `not` is done by adding an exclamation mark in the begining `!year=2010`. `isNotNull` is done by `publisher=*`.

A new type of aggregation is added, namely stats. stats can be used on numeric fields `stats=year` will return min, max, avg and count.

Nested entities can be queried as objects by order convention and a seperator. So a list of authors can be queried by first name last name by `authors=Tim__Hansen`.

metadata for the query is returned by `includeMeta=true`. This will return the GET query, the predicate it was transformed to as well as the ES query.

The result format is that of ES.

## Differences in predicates
2 new predicate types added. 
`nested`: which allows for querying list of objects (such as a list of authors).
`range`: which is a more compact way to do the same as `greaterThanOrEquals` etc. as we have in the occurrence API.

## Suggest a configuration
The current configurations are generated from the ES `_mapping` endpoint.

# Install
`npm i`

# Start
`node src/index.js --port=4001`