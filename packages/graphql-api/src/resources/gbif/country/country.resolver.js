import _ from 'lodash';
// import { getOccurrenceFacet } from '../occurrence/occurrence.resolver';

// async function getCountryDetail(countryCode, dataSources) {
//   const publisherCount = await dataSources.organizationAPI
//     .searchOrganizations({ query: { country: countryCode, limit: 0 } })
//     .then((response) => response.count);
//   const datasetCount = await dataSources.datasetAPI
//     .searchDatasets({ query: { country: countryCode, limit: 0 } })
//     .then((response) => response.count);
//   const institutionCount = await dataSources.institutionAPI
//     .searchInstitutions({ query: { country: countryCode, limit: 0 } })
//     .then((response) => response.count);
//   const collectionCount = await dataSources.collectionAPI
//     .searchCollections({ query: { country: countryCode, limit: 0 } })
//     .then((response) => response.count);
//   const participants = await dataSources.participantAPI
//     .searchParticipants({ query: { country: countryCode, limit: 100 } })
//     .then((response) => response.results);
//   return {
//     key: countryCode,
//     publisherCount,
//     datasetCount,
//     institutionCount,
//     collectionCount,
//     participants: participants,
//   };
// }

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
  Query: {
    countryDetail: (parent, { isoCode }) => isoCode,
  },
  CountryDetail: {
    // The total number of occurrences published that are geographically FROM/WITHIN this country (regardless of publisher)
    aboutOccurrenceCount: (isoCode, _args, { dataSources }) =>
      dataSources.occurrenceAPI
        .searchOccurrences({ query: { country: isoCode, size: 0 } })
        .then((response) => response.documents.total),

    // The number of datasets published that contain occurrences FROM this country
    aboutDatasetCount: (isoCode, _args, { dataSources }) =>
      dataSources.occurrenceAPI
        .searchOccurrences({
          query: {
            predicate: {
              type: 'equals',
              key: 'country',
              value: isoCode,
            },
            size: 0,
            metrics: {
              facet: { type: 'facet', key: 'datasetKey', size: 20000 },
            },
          },
        })
        .then((response) => response.aggregations.facet.buckets.length),

    // The number of distinct countries that have published occurrences geographically originating FROM/WITHIN this country
    aboutCountryCount: (isoCode, _args, { dataSources }) =>
      dataSources.occurrenceAPI
        .searchOccurrences({
          query: {
            predicate: {
              type: 'equals',
              key: 'country',
              value: isoCode,
            },
            size: 0,
            metrics: {
              facet: {
                type: 'facet',
                key: 'publishingCountry',
                size: 300,
              },
            },
          },
        })
        .then((response) => response.aggregations.facet.buckets.length),

    // The number of distinct publishers that have published occurrences geographically originating FROM/WITHIN this country
    aboutPublisherCount: (isoCode, _args, { dataSources }) =>
      dataSources.occurrenceAPI
        .searchOccurrences({
          query: {
            predicate: {
              type: 'equals',
              key: 'country',
              value: isoCode,
            },
            size: 0,
            metrics: {
              facet: {
                type: 'facet',
                key: 'publishingOrg',
                size: 1000,
              },
            },
          },
        })
        .then((response) => response.aggregations.facet.buckets.length),

    // The number of occurrences published BY this country
    fromOccurrenceCount: (isoCode, _args, { dataSources }) =>
      dataSources.occurrenceAPI
        .searchOccurrences({
          query: { publishingCountry: isoCode, limit: 0 },
        })
        .then((response) => response.documents.total),

    // The number of datasets published BY this country
    fromDatasetCount: (isoCode, _args, { dataSources }) =>
      dataSources.datasetAPI
        .searchDatasets({ query: { publishingCountry: isoCode, limit: 0 } })
        .then((response) => response.count),

    // The number of distinct countries IN WHICH this country has published occurrence data
    fromCountryCount: (isoCode, _args, { dataSources }) =>
      dataSources.occurrenceAPI
        .searchOccurrences({
          query: {
            predicate: {
              type: 'equals',
              key: 'publishingCountry',
              value: isoCode,
            },
            size: 0,
            metrics: {
              facet: {
                type: 'facet',
                key: 'country',
                size: 300,
              },
            },
          },
        })
        .then((response) => response.aggregations.facet.buckets.length),

    // The number of publishers geographically LOCATED IN this country
    fromPublisherCount: (isoCode, _args, { dataSources }) =>
      dataSources.organizationAPI
        .searchOrganizations({
          query: {
            isEndorsed: true,
            country: isoCode,
            limit: 0,
          },
        })
        .then((response) => response.count),
  },
};
