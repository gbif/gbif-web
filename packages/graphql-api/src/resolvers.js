import { get, merge } from 'lodash';
import * as resources from './resources';
import config from './config';

// Treat each top-level configuration entry as an 'organisation' (i.e., GBIF, ALA)
const organizations = Object.keys(config).filter(
  (org) => !['debug', 'port'].includes(org),
);

// Map each organisation string to an aggregate object containing all of its resolvers
const resolvers = organizations
  .map((org) =>
    (config[org].resources || []).reduce(
      (agg, resource) =>
        merge(agg, get(resources, `${org}.${resource}.resolver`)),
      {},
    ),
  )
  .reduce((agg, resource) => merge(agg, resource), {});

export default resolvers;
