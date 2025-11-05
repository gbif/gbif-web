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

query OccurrenceSearch {
  occurrenceSearch(size: 1) {
    documents {
      results {
        scientificName
        decimalLatitude
        decimalLongitude
        countryCode
        year
      }
    }
    facet {
      countryCode {
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
      speciesKey
    }
  }
}

Data from graphql is returned as {data: {...}}.

It is also possible to use jq to filter and transform the data returned.

### Chart Colors
Default color schema for visualizations:
#4C9C2E, #E37C72, #D1628E, #ECAC7C, #00B7EE, #6885C0, #664192, #F2BF48, #0078B4

## Usage token
To use the other tools you need this token: I_HAVE_READ_THE_GUIDELINES
`;
