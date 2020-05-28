const { gql } = require('apollo-server');

const typeDef = gql`
  input Predicate {
    type: PredicateType,
    key: String,
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

module.exports = typeDef;