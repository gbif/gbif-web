import { gql } from "apollo-server";

const typeDef = gql`
  extend type Query {
    gbifProject(id: String!, preview: Boolean): GbifProject
  }

  type GbifProject {
    id: ID
    gbifHref: String
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
    primaryImage: AssetImage
    fundsAllocated: Int
    leadContact: String
    searchable: Boolean
    contractCountry: String
    call: Call
    gbifProgrammeAcronym: String
    projectId: String
    # TODO
    # additionalPartners: [ParticipantOrOrganisation]
    status: String
    homepage: Boolean
    keywords: [String]
    documents: [DocumentAsset]
    events: [Event]
    programme: Programme
    excerpt: String
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
    meta: JSON
  }

  type Programme {
    id: String
    summary: String
    body: String
    title: String
    excerpt: String
  }

  union ParticipantOrOrganisation = Participant | Organization
`

export default typeDef;