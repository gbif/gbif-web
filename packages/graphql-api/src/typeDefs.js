import gql from 'graphql-tag';
import { get } from 'lodash';
import { getEnumTypeDefs } from '#/helpers/enums';
import * as resources from './resources';
import config from './config';

const inputTypeDef = gql`
  input Predicate {
    type: PredicateType
    key: String
    value: JSON
    values: [JSON]
    latitude: JSON
    longitude: JSON
    distance: String
    predicate: Predicate
    predicates: [Predicate]
  }

  enum PredicateType {
    and
    or
    not
    equals
    in
    within
    isNotNull
    like
    fuzzy
    nested
    range
    geoDistance
  }
`;

async function getSchema() {
  // create a string with all the enum options (loaded from the API)
  const enumsSchema = await getEnumTypeDefs();

  const rootQuery = gql`
    ${enumsSchema}

    type Query {
      """
      _empty is nonsense, and only here as we are not allowed to extend an empty type.
      """
      _empty: String
    }
  `;

  // Map each organisation string to an aggregate array containing all of its typeDefs
  const organization = config.organization;
  const orgTypeDefs = Object.keys(resources[organization]).map(resource => get(resources, `${organization}.${resource}.typeDef`));

  const typeDefs = [
    rootQuery,
    inputTypeDef,
    ...orgTypeDefs
  ].flat();

  return typeDefs;
}

export default getSchema;
