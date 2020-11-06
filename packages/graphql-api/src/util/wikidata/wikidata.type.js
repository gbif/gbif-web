const { gql } = require('apollo-server');

const typeDef = gql`
  type WikiDataTaxonData {
    identifiers: [WikiDataIdentifier]
    source: WikiDataTaxonSourceItem
    iucn: WikiDataTaxonIUCNData
  }

  type WikiDataTaxonIUCNData {
    threatStatus: JSON!
    identifier: WikiDataIdentifier!
  }

  type WikiDataTaxonSourceItem {
    id: String!
    url: String!
  }
  
  type WikiDataIdentifier {
    id: String!
    url: String!
    description: JSON
    label: JSON
  }
`;

module.exports = typeDef;