import { merge } from 'lodash';
import * as resources from './resources';

const idResolver = {
  Query: {
    _queryId: (_parent, _args, { queryId }) => queryId,
    _variablesId: (_parent, _args, { variablesId }) => variablesId,
  },
};

const resolvers = Object.values(resources).reduce(
  (agg, resource) => merge(agg, resource.resolver),
  {},
);

merge(resolvers, idResolver);

export default resolvers;
