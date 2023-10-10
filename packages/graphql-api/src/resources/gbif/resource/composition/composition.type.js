import { gql } from "apollo-server";

const typeDef = gql`
  extend type Query {
    composition(id: String!, preview: Boolean): Composition
  }

  type Composition {
    id: ID
    summary: String
    createdAt: DateTime
    # TODO: Add blocks when the changes has been made in the API
    title: String
    updatedAt: DateTime
    primaryImage: Image
    keywords: [String]
    urlAlias: String
    machineIdentifier: String
  }
`

export default typeDef;