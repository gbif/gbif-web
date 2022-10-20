import { gql } from 'apollo-server';
import { get } from 'lodash';
import { getEnumTypeDefs } from '#/helpers/enums';
import * as resources from './resources';
import config from './config';

// Treat each top-level configuration entry as an 'organisation' (i.e., GBIF, ALA)
const organizations = Object.keys(config).filter(
  (org) => !['debug', 'port'].includes(org),
);

const inputTypeDef = gql`
  input Predicate {
    type: PredicateType
    key: String
    value: JSON
    values: [JSON]
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
  const typeDefs = [
    rootQuery,
    inputTypeDef,
    ...organizations.map((org) =>
      (config[org].resources || []).map((resource) =>
        get(resources, `${org}.${resource}.typeDef`),
      ),
    ),
  ].flat(2);

  return typeDefs;
}

export default getSchema;
