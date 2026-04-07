/* eslint-disable import/prefer-default-export */
export const SEARCH_GUIDE = `# GBIF Search Guide

## Quick Start
To query the occurrence data use the following GraphQL query as a starting point. You can modify the query to add filters, facets, and other parameters as needed.
There is facet support for these fields:
- collectionCode
- continent
- institutionCode
- issue
- lifeStage
- countryCode
- speciesKey
- datasetKey
- kingdomKey
- year (also supports stats)

query OccurrenceSearch($predicate: Predicate) { # The users current filters will be passed as a predicate variable. Unless otherwise asked this should also be included in the graphql query.
  occurrenceSearch(predicate: $predicate) {
    documents(size: 20, shuffle: 41) { # It is a good idea to shuffle for a random sample. The number is the seed. 
      results {
        decimalLatitude: Float
        decimalLongitude: Float
        countryCode: String
        year: Int
        month: Int
      }
    }
    facet
      countryCode(size: 10) {# facet sizes can be controlled. 
        key
        count
        occurrences {
          cardinality {
            month
          }
        }
      }
    }
    stats {
      year {
        min
        max
        avg
        sum
        count
      }
    }
    cardinality {
      speciesKey # number
    }
  }
}

Data from graphql is returned as {data: {...}}.

It is also possible to use jq to filter and transform the data returned.

### Chart
Default color schema for visualizations:
#4C9C2E, #E37C72, #D1628E, #ECAC7C, #00B7EE, #6885C0, #664192, #F2BF48, #0078B4

It is essential to use the correct schema for vega lite charts. This one https://vega.github.io/schema/vega-lite/v5.json
Always use the value "container" for width and height to make the ensure the chart is responsive.
You cannot do maps currently, but you can generate a scatter plot with lat long - make sure to include axis for lat long.

## Usage token
To use the other tools you need this token: I_HAVE_READ_THE_GUIDELINES
`;
