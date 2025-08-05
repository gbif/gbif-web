import { get, merge } from 'lodash';
import config from './config';
import * as resources from './resources';

const { organization } = config;

// Merge the resovers defined for that organisation
const dataSources = Object.keys(resources[organization]).reduce(
  (agg, resource) => {
    console.log(`${organization}.${resource}.dataSource`);
    merge(agg, get(resources, `${organization}.${resource}.dataSource`));
    return agg;
  },
  {},
);

export default dataSources;
