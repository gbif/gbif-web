import { get, merge } from 'lodash';
import config from './config';
import * as resources from './resources';

const { organization } = config;

const idResolver = {
  Query: {
    _queryId: (_parent, _args, { queryId }) => queryId,
    _variablesId: (_parent, _args, { variablesId }) => variablesId,
  },
};

// Merge the resovers defined for that organisation
const resolvers = Object.keys(resources[organization]).reduce(
  (agg, resource) =>
    merge(agg, get(resources, `${organization}.${resource}.resolver`)),
  {},
);

merge(resolvers, idResolver);

export default resolvers;
