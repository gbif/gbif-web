import { gql } from "apollo-server";

const typeDef = gql`
    extend type Query {
        project(id: String!, preview: Boolean): Project!
    }

    type CMSProject {
        id: ID!
        leadPartner: ProjectPartner
        title: String!
        officialTitle: String
        body: String
        gbifRegion: String!
        createdAt: String!
        start: String
        end: String
        matchingFunds: Int
        ${/* TODO: programme: String */''}
        primaryImage: Image
        fundsAllocated: Int
        leadContact: String
        searchable: Boolean!
        contractCountry: String!
        call: ProjectCall
        gbifProgrammeAcronym: String!
        ${/* TODO: Should probably be a resolvable project */''}
        projectId: String
        additionalPartners: [ProjectPartner]
        status: String!
        homepage: Boolean!
        keywords: [String]
        documents: [Document]
        events: [Event]
    }

    type ProjectPartner {
        id: ID!
        country: String
        title: String!
    }

    type ProjectCall {
        id: ID!
        title: String!
    }
`

export default typeDef;