import gql from 'graphql-tag';

const typeDef = gql`
  extend type Query {
    person(type: String, value: String, expand: Boolean): Person
  }

  type Person {
    name: JSON
    birthDate: JSON
    deathDate: JSON
    image: JSON
  }
`;

export default typeDef;
