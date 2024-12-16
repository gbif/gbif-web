import _ from 'lodash';

async function getCountryDetails(countryCodes, dataSources) {
  const results = await Promise.all(
    countryCodes.map((countryCode) =>
      getCountryDetail(countryCode, dataSources),
    ),
  );
  return results;
}

async function getCountryDetail(countryCode, dataSources) {
  const publisherCount = await dataSources.organizationAPI
    .searchOrganizations({ query: { country: countryCode, limit: 0 } })
    .then((response) => response.count);
  const datasetCount = await dataSources.datasetAPI
    .searchDatasets({ query: { country: countryCode, limit: 0 } })
    .then((response) => response.count);
  const institutionCount = await dataSources.institutionAPI
    .searchInstitutions({ query: { country: countryCode, limit: 0 } })
    .then((response) => response.count);
  const collectionCount = await dataSources.collectionAPI
    .searchCollections({ query: { country: countryCode, limit: 0 } })
    .then((response) => response.count);
  const participants = await dataSources.participantAPI
    .searchParticipants({ query: { country: countryCode, limit: 100 } })
    .then((response) => response.results);
  return {
    key: countryCode,
    publisherCount,
    datasetCount,
    institutionCount,
    collectionCount,
    participants: participants,
    isVotingParticipant: _.some(participants, {
      participationStatus: 'VOTING',
    }),
  };
}

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
  Query: {
    countries: (parent, args, { dataSources }) =>
      dataSources.countryAPI
        .getCountryCodes()
        .then((response) => getCountryDetails(response, dataSources)),
    country: (parent, { key }, { dataSources }) =>
      dataSources.collectionAPI.getCountryByKey({ key }),
  },
  CountryDetail: {},
};
