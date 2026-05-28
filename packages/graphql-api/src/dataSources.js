import { merge } from 'lodash';
import * as resources from './resources';

const dataSources = Object.values(resources).reduce(
  (agg, resource) => merge(agg, resource.dataSource),
  {},
);

export default dataSources;
