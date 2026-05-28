import { gql } from 'apollo-server';
import { getEnumTypeDefs } from '@/helpers/enums';
import * as resources from './resources';

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
    checklistKey: ID
    matchCase: Boolean
    parameter: String
    geometry: String
  }

  enum PredicateType {
    and
    or
    not
    equals
    in
    within
    isNotNull
    isNull
    like
    fuzzy
    nested
    range
    geoDistance
    greaterThan
    greaterThanOrEquals
    lessThanOrEquals
    lessThan
  }
`;

async function getSchema() {
  // create a string with all the enum options (loaded from the API)
  const enumsSchema = await getEnumTypeDefs();

  const rootQuery = gql`
    enum CacheControlScope {
      PUBLIC
      PRIVATE
    }

    directive @cacheControl(
      maxAge: Int
      scope: CacheControlScope
      inheritMaxAge: Boolean
    ) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION

    ${enumsSchema}

    type Query {
      """
      _empty is nonsense, and only here as we are not allowed to extend an empty type.
      """
      _empty: String
      _queryId: String!
      _variablesId: String
    }
  `;

  const resourceTypeDefs = Object.values(resources).map(
    (resource) => resource.typeDef,
  );

  return [rootQuery, inputTypeDef, ...resourceTypeDefs].flat();
}

export default getSchema;
