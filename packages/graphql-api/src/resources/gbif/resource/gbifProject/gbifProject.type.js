import { gql } from "apollo-server";

const typeDef = gql`
  extend type Query {
    gbifProject(id: String!, preview: Boolean): GbifProject
  }

  type GbifProject {
    id: ID!
    gbifHref: String!
    leadPartner: ParticipantOrFundingOrganisation
    title: String!
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
    searchable: Boolean!
    contractCountry: String
    call: Call
    gbifProgrammeAcronym: String
    projectId: String
    additionalPartners: [ParticipantOrFundingOrganisation]
    status: String
    homepage: Boolean!
    keywords: [String!]
    documents: [DocumentAsset!]
    events: [Event!]
    programme: Programme
    excerpt: String
    updatedAt: DateTime
    grantType: String
    primaryLink: Link
    news: [News!]
    fundingOrganisations: [ParticipantOrFundingOrganisation]
    purposes: [String!]
    secondaryLinks: [Link!]
    overrideProgrammeFunding: [FundingOrganisation]
    meta: JSON
  }

  union ParticipantOrFundingOrganisation = Participant | FundingOrganisation
`

export default typeDef;