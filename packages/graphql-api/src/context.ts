import { ApolloServer } from '@apollo/server';
import { IncomingMessage } from 'node:http';
import { get } from 'lodash';
import type { KeyValueCache } from '@apollo/utils.keyvaluecache';
// how to fetch the actual data and possible format/remap it to match the schemas
import api from './dataSources';
import config from './config';

type Options = {
  req: IncomingMessage;
  server: ApolloServer<Context>;
  user: any;
};

export class Context {
  public abortController = new AbortController();
  public userAgent: string;
  public referer: string | null;
  public locale: string;
  public preview: boolean;
  // User is not typed
  public user: Promise<any>;
  // Datasources are not typed
  public dataSources: Record<string, any>;
  //
  public cache: KeyValueCache;
  // Config is not typed
  public config = config;

  constructor({ req, server, user }: Options) {
    this.userAgent = get(req, 'headers.User-Agent') || 'GBIF_GRAPHQL_API';
    this.referer = get(req, 'headers.referer') || null;
    this.locale = get(req, 'headers.locale') || 'en-GB';
    this.preview = get(req, 'headers.preview') === 'true';

    // on all requests attach a user if present
    this.user = user;

    // Add express context and a listener for aborted connections. Then data sources have a chance to cancel resources
    // I haven't been able to find any examples of people doing anything with cancellation - which I find odd.
    // Perhaps the overhead isn't worth it in most cases?
    req.on('close', () => {
      this.abortController.abort();
    });

    // Passing the cache to the classes that inherit from RESTDataSource will forward the cache to the RESTDataSource when calling super()
    this.cache = server.cache;

    this.dataSources = Object.keys(api).reduce(
      (prev, cur) => ({
        ...prev,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [cur]: new (api as { [key: string]: any })[cur](this),
      }),
      {},
    );
  }
}
