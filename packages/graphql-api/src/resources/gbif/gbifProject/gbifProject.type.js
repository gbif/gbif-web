import { gql } from "apollo-server";

const typeDef = gql`
    extend type Query {
        gbifProject(id: String!, preview: Boolean): GbifProject
    }

    type GbifProject {
        id: ID
        # leadPartner: ParticipantOrOrganisation
        title: String
        officialTitle: String
        body: String
        summary: String
        gbifRegion: GbifRegion
        createdAt: DateTime
        start: DateTime
        end: DateTime
        matchingFunds: Int
        primaryImage: Image
        fundsAllocated: Int
        leadContact: String
        searchable: Boolean
        contractCountry: String
        call: ProjectCall
        gbifProgrammeAcronym: String
        projectId: String
        # TODO
        # additionalPartners: [ParticipantOrOrganisation]
        status: String
        homepage: Boolean
        keywords: [String]
        documents: [Document]
        events: [Event]
        programme: Programme
        previewText: String
        updatedAt: DateTime
        grantType: String
        primaryLink: Link
        news: [News]
        # TODO
        # fundingOrganisations: [ParticipantOrOrganisation]
        purposes: [String]
        secondaryLinks: [Link]
        # TODO
        # overrideProgrammeFunding: [Organization]
    }

    type Programme {
        id: String
        summary: String
        body: String
        title: String
        previewText: String
    }

    union ParticipantOrOrganisation = Participant | Organization

    type ProjectCall {
        id: ID
        title: String
    }
`

export default typeDef;