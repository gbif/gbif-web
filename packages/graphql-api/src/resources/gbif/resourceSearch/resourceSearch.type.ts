import { DataUse } from "#/helpers/contentful/entities/dataUse";
import { Event } from "#/helpers/contentful/entities/event";
import { News } from "#/helpers/contentful/entities/news";
import { Notification } from "#/helpers/contentful/entities/notification";
import { gql } from "apollo-server-core";

export type SingleSearchResult = DataUse | Event | Notification | News;

export type PaginatedSearchResult = {
    results: SingleSearchResult[]
    limit: number
    offset: number
    count: number
    endOfRecords: boolean
}

const typeDef = gql`
    extend type Query {
        resourceSearch(input: SearchInput!): PaginatedSearchResult!
    }

    input SearchInput {
        q: String
        from: Int
        contentType: String
        topics: [String!]
        countriesOfCoverage: [String!]
        countriesOfResearcher: [String!]
    }

    union SingleSearchResult = DataUse | Event | Notification | News

    type PaginatedSearchResult {
        results: [SingleSearchResult!]!
        limit: Int!
        offset: Int!
        count: Int!
        endOfRecords: Boolean!
    }
`;

export default typeDef;