import { gql } from "apollo-server";

const typeDef = gql`
    extend type Query {
        event(id: String!, preview: Boolean): Event
    }

    type Event {
        id: ID
        title: String
        summary: String
        body: String
        previewText: String
        primaryImage: Image
        primaryLink: Link
        secondaryLinks: [Link]
        start: DateTime
        end: DateTime
        allDayEvent: Boolean
        organisingParticipants: [Participant]
        venue: String
        location: String
        country: String
        coordinates: Coordinates
        eventLanguage: String
        documents: [Document]
        attendees: String
        keywords: [String]
        searchable: Boolean
        homepage: Boolean
        gbifRegion: GbifRegion
        createdAt: DateTime
        updatedAt: DateTime
        gbifsAttendee: String
    }
`

export default typeDef;