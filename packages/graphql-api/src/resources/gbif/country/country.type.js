import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    countryDetail(isoCode: Country!): CountryDetail
  }

  type CountryDetail {
    """
    The total number of occurrences published that are geographically FROM/WITHIN this country (regardless of publisher)
    """
    aboutOccurrenceCount: Int!

    """
    The number of datasets published that contain occurrences FROM this country
    """
    aboutDatasetCount: Int!

    """
    The number of distinct countries that have published occurrences geographically originating FROM/WITHIN this country
    """
    aboutCountryCount: Int!

    """
    The number of distinct publishers that have published occurrences geographically originating FROM/WITHIN this country
    """
    aboutPublisherCount: Int!

    """
    The number of occurrences published BY this country
    """
    fromOccurrenceCount: Int!

    """
    The number of datasets published BY this country
    """
    fromDatasetCount: Int!

    """
    The number of distinct countries IN WHICH this country has published occurrence data
    """
    fromCountryCount: Int!

    """
    The number of publishers geographically LOCATED IN this country
    """
    fromPublisherCount: Int!
  }
`;

export default typeDef;
