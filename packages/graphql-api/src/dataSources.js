import { merge } from 'lodash';
import * as resources from './resources';

const api = merge(
  resources.gbif.dataset.dataSource,
  resources.gbif.organization.dataSource,
  resources.gbif.taxon.dataSource,
  resources.gbif.network.dataSource,
  resources.gbif.installation.dataSource,
  resources.gbif.node.dataSource,
  resources.gbif.participant.dataSource,
  resources.gbif.occurrence.dataSource,
  resources.gbif.wikidata.dataSource,
  resources.gbif.collection.dataSource,
  resources.gbif.institution.dataSource,
  resources.gbif.staffMember.dataSource,
  resources.gbif.external.orcid.dataSource,
  resources.gbif.external.viaf.dataSource,
  resources.gbif.external.person.dataSource,
  resources.gbif.literature.dataSource,
  resources.gbif.download.dataSource,
);

// merge resolvers as suggeted in https://blog.apollographql.com/modularizing-your-graphql-schema-code-d7f71d5ed5f2
// TODO perhaps we should add an alert of keys are used twice
export default api;
