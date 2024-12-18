import { get, merge } from 'lodash';
import config from './config';
import * as resources from './resources';

const organization = config.organization;

// Merge the resovers defined for that organisation
const dataSources = Object.keys(resources[organization]).reduce(
  (agg, resource) =>
    merge(agg, get(resources, `${organization}.${resource}.dataSource`)),
  {},
);

export default dataSources;
