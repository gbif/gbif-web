import { gql } from "apollo-server";

const typeDef = gql`
    extend type Query {
        dataUse(id: String!, preview: Boolean): DataUse!
    }

    type DataUse {
        id: ID!
        title: String!
        summary: String
        body: String
        primaryImage: Image
        primaryLink: Link
        secondaryLinks: [Link]
        citation: String
        resourceUsed: String
        countriesOfResearchers: [String]
        countriesOfCoverage: [String]
        topics: [String]
        purposes: [String]
        audiences: [String]
        keywords: [String]
        searchable: Boolean
        homepage: Boolean
    }
`;

export default typeDef;