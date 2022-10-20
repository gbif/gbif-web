import { merge } from 'lodash';
import * as resources from './resources';

const resolvers = merge(
  resources.gbif.scalars.resolver,
  resources.gbif.dataset.resolver,
  resources.gbif.organization.resolver,
  resources.gbif.taxon.resolver,
  resources.gbif.network.resolver,
  resources.gbif.installation.resolver,
  resources.gbif.node.resolver,
  resources.gbif.participant.resolver,
  resources.gbif.occurrence.resolver,
  resources.gbif.wikidata.resolver,
  resources.gbif.collection.resolver,
  resources.gbif.institution.resolver,
  resources.gbif.staffMember.resolver,
  resources.gbif.external.orcid.resolver,
  resources.gbif.external.viaf.resolver,
  resources.gbif.external.person.resolver,
  resources.gbif.literature.resolver,
  resources.gbif.download.resolver,
);

// merge resolvers as suggeted in https://blog.apollographql.com/modularizing-your-graphql-schema-code-d7f71d5ed5f2
// TODO perhaps we should add an alert of keys are used twice
export default resolvers;
