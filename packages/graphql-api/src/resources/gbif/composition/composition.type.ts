import { gql } from "apollo-server";

const typeDef = gql`
    extend type Query {
        composition(id: String!, preview: Boolean): Composition!
    }

    type Composition {
        id: ID!
    }
`

export default typeDef;