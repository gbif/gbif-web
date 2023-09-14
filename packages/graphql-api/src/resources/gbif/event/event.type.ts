import { gql } from "apollo-server";

const typeDef = gql`
    extend type Query {
        event(id: String!): Event!
    }

    type Event {
        id: ID!
        title: String!
        summary: String
        body: String
        primaryImage: Image
        primaryLink: Link
        secondaryLinks: [Link]
        start: String!
        end: String!
        allDayEvent: Boolean
        organisingParticipants: [Participant]
        venue: String
        location: String
        country: String
        # TODO: Figure out what this is
        coordinates: String
        eventLanguage: String
        documents: [Document]
        attendees: String
        keywords: [String]
        searchable: Boolean
        homepage: Boolean
    }

    # All types that compose the Image type
    type ImageFileDetails {
        size: Int!
        width: Int!
        height: Int!
    }

    type ImageFile {
        url: String!
        details: ImageFileDetails!
        fileName: String!
        contentType: String!
    }

    type Image {
        file: ImageFile!
        description: String
        title: String
    }

    # All types that compose the Link type
    type Link {
        label: String!
        url: String!
    }

    # All types that compose the Country type
    type Participant {
        country: String!
        title: String!
    }

    # All types that compose the Document type
    type DocumentFileDetails {
        size: Int!
    }

    type DocumentFile {
        url: String!
        details: DocumentFileDetails!
        fileName: String!
        contentType: String!
    }

    type Document {
        file: DocumentFile!
        description: String
        title: String
    }
`

export default typeDef;