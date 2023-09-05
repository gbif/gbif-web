import { gql } from "apollo-server";

export type Event = {
    title: string;
    summary?: string;
    body?: string;
    // Id of contentful Asset entry
    primaryImageId?: string;
    primaryLink?: string;
    secondaryLinks: string[];
    start: Date;
    end: Date;
    allDayEvent: boolean;
    // Ids of contentful Participant entries
    organisingParticipantsIds: string[];
    venue?: string;
    location?: string;
    // Id of contentful country entry
    countryId?: string;
    coordinates?: unknown;
    eventLanguage?: unknown;
    // Ids of contentful Asset entries
    documents?: string[];
    attendees?: string;
    keywords: string[];
    searchable: boolean;
    homepage: boolean;
}

const typeDef = gql`
    extend type Query {
        event(id: String!): Event!
    }

    type Event {
        title: String!
        summary: String
        body: String
        primaryImageId: String
        primaryLink: String
        secondaryLinks: [String]
        start: String!
        end: String!
        allDayEvent: Boolean
        organisingParticipantsIds: [String]
        venue: String
        location: String
        countryId: String
        coordinates: String
        eventLanguage: String
        documents: [String]
        attendees: String
        keywords: [String]
        searchable: Boolean
        homepage: Boolean
    }
`

export default typeDef;