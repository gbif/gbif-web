import { gql } from 'apollo-server';
import { flatten } from 'lodash';
import { getEnumTypeDefs } from '#/helpers/enums';
import * as resources from './resources';

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

  const typeDefs = flatten([
    rootQuery,
    inputTypeDef,
    resources.gbif.misc.comment,
    resources.gbif.misc.contact,
    resources.gbif.misc.endpoint,
    resources.gbif.misc.identifier,
    resources.gbif.misc.machineTag,
    resources.gbif.misc.tag,
    resources.gbif.misc.address,
    resources.gbif.dataset.typeDef,
    resources.gbif.organization.typeDef,
    resources.gbif.scalars.typeDef,
    resources.gbif.taxon.typeDef,
    resources.gbif.network.typeDef,
    resources.gbif.installation.typeDef,
    resources.gbif.node.typeDef,
    resources.gbif.participant.typeDef,
    resources.gbif.occurrence.typeDef,
    resources.gbif.wikidata.typeDef,
    resources.gbif.collection.typeDef,
    resources.gbif.institution.typeDef,
    resources.gbif.staffMember.typeDef,
    resources.gbif.external.orcid.typeDef,
    resources.gbif.external.viaf.typeDef,
    resources.gbif.external.person.typeDef,
    resources.gbif.literature.typeDef,
    resources.gbif.download.typeDef,
  ]);

  return typeDefs;
}

export default getSchema;
