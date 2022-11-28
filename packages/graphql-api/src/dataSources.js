import { get, merge } from 'lodash';
import * as resources from './resources';
import config from './config';

const organization = config.organization;

// Merge the resovers defined for that organisation
const dataSources = Object.keys(resources[organization]).reduce(
  (agg, resource) =>
    merge(agg, get(resources, `${organization}.${resource}.dataSource`)),
  {},
);

export default dataSources;
