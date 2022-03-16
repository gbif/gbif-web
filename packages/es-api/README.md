# A wrapper for the GBIF Elastic Search indices
This project takes an Elastic Search index and expose it with an API similar to GBIF APIv1 + a predicate search API similar to GBIF download API.

> This project doesn't not use public APIs, so running it require access to our VPN.

It has a GET API, similar to our other APIs as well as a post API that use the predicate structure from the GBIF occurrence download API. But there are differences. most notably in the response format.

## Differences in GET
The GET api is extended to allow for `not` and `isNotNull`. `not` is done by adding an exclamation mark in the begining `!year=2010`. `isNotNull` is done by `publisher=*`.

A new type of aggregation is added, namely stats. Stats can be used on numeric fields `stats=year` will return min, max, avg and count. Cardinality aggregations can be done with `cardinality=year`.

Nested entities can be queried as objects by order convention and a seperator. So a list of authors can be queried by first name last name by `authors=Tim__Hansen`.

metadata for the query is returned by `includeMeta=true`. This will return the GET query, the predicate it was transformed to as well as the ES query.

The result format is done with a reducer that maps the ES response to something more similar to our APIv1.

## Differences in predicates
2 new predicate types added. 
`nested`: which allows for querying list of objects (such as a list of authors).
`range`: which is a more compact way to do the same as `greaterThanOrEquals` etc. as we have in the occurrence API.

## Suggest a configuration
The current configurations are generated from the ES `_mapping` endpoint. But not dynamically, but upon request. It is far from perfect, but it is a help instead of typing everything by hand.

# Install
requires node v16.13.1
`npm i`

# env file
The `.env`-file should be placed in root and can be found in `gbif-configuration/gbif-web`

Environment file example:
```yml
apiKey: something # this is a fixed key that needs to be added in requests. Since it is all behind vpn we could consider removing it

literature:
  hosts: [http://some.elastic.instance:9200]
  requestTimeout: 30000
  maxRetries: 3
  maxResultWindow: 100000

occurrence:
  hosts: [http://some.elastic.instance:9200]
  requestTimeout: 60000
  maxRetries: 3
  maxResultWindow: 100000

dataset:
  hosts: [http://some.elastic.instance:9200]
  requestTimeout: 30000
  maxRetries: 3
  maxResultWindow: 100000

event:
  hosts: [http://some.elastic.instance:9200]
  requestTimeout: 30000
  maxRetries: 3
  maxResultWindow: 100000
  index: event

port: 4001
```

# Start
for development with Nodemon: `npm start` else `node src/index.js --port=4001`