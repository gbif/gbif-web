import { get, merge } from 'lodash';
import * as resources from './resources';
import config from './config';

// Treat each top-level configuration entry as an 'organisation' (i.e., GBIF, ALA)
const organizations = Object.keys(config).filter(
  (org) => !['debug', 'port'].includes(org),
);

// Map each organisation string to an aggregate object containing all of its dataSources
const dataSources = organizations
  .map((org) =>
    (config[org].resources || []).reduce(
      (agg, resource) =>
        merge(agg, get(resources, `${org}.${resource}.dataSource`)),
      {},
    ),
  )
  // Combine the different resolvers for each organisation
  .reduce((agg, resource) => merge(agg, resource), {});

export default dataSources;
