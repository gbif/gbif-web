import { Config } from '@/config/config';
import {
  GbifEnv,
  getDefaultEndpointsBasedOnGbifEnv,
  InvalidGbifEnvError,
  isGbifEnv,
} from '@/config/endpoints';
import { merge } from 'ts-deepmerge';

// The env options
type Options = {
  gbifEnv: GbifEnv;
  baseUrl: string;
  translationsEntryEndpoint: string;
  countEndpoint: string;
  v1Endpoint: string;
  webApiEndpoint: string;
  // When running e2e tests, we need a separate endpoint for the server and client as the server needs the endpoint in on the
  // internal docker network and the client needs the endpoint on the host machine
  graphqlEndpoint: string;
  graphqlEndpointServer: string;
  graphqlEndpointClient: string;
  formsEndpoint: string;
  formsEndpointServer: string;
  formsEndpointClient: string;
};

// Extract config options from the environment variables
const envConfig = {
  gbifEnv: import.meta.env.PUBLIC_GBIF_ENV,
  baseUrl: import.meta.env.PUBLIC_BASE_URL,
  translationsEntryEndpoint: import.meta.env.PUBLIC_TRANSLATIONS_ENTRY_ENDPOINT,
  countEndpoint: import.meta.env.PUBLIC_COUNT_ENDPOINT,
  v1Endpoint: import.meta.env.PUBLIC_V1_ENDPOINT,
  webApiEndpoint: import.meta.env.PUBLIC_WEB_API_ENDPOINT,
  graphqlEndpoint: import.meta.env.PUBLIC_GRAPHQL_ENDPOINT,
  graphqlEndpointServer: import.meta.env.PUBLIC_GRAPHQL_ENDPOINT_SERVER,
  graphqlEndpointClient: import.meta.env.PUBLIC_GRAPHQL_ENDPOINT_CLIENT,
  formsEndpoint: import.meta.env.PUBLIC_FORMS_ENDPOINT,
  formsEndpointServer: import.meta.env.PUBLIC_FORMS_ENDPOINT_SERVER,
  formsEndpointClient: import.meta.env.PUBLIC_FORMS_ENDPOINT_CLIENT,
} as Partial<Options>;

// Validate that the required config options are present and valid
if (!envConfig.gbifEnv) throw new Error('Missing PUBLIC_GBIF_ENV env variable');
if (!isGbifEnv(envConfig.gbifEnv)) throw new InvalidGbifEnvError(envConfig.gbifEnv);

if (!envConfig.baseUrl) throw new Error('Missing PUBLIC_BASE_URL env variable');

// Merge the config based on the priority order: ENV > default
const options = merge.withOptions(
  { allowUndefinedOverrides: false },
  getDefaultEndpointsBasedOnGbifEnv(envConfig.gbifEnv),
  envConfig
) as Options;

const isServer = () => typeof window === 'undefined';

export const gbifConfig: Config = {
  ...options,
  get graphqlEndpoint() {
    if (isServer()) {
      return options.graphqlEndpointServer ?? options.graphqlEndpoint;
    }
    return options.graphqlEndpointClient ?? options.graphqlEndpoint;
  },
  get formsEndpoint() {
    if (isServer()) {
      return options.formsEndpointServer ?? options.formsEndpoint;
    }
    return options.formsEndpointClient ?? options.formsEndpoint;
  },
  // pages: [
  //   {
  //     id: 'home',
  //   },
  //   {
  //     id: 'occurrence-search',
  //   },
  //   {
  //     id: 'dataset-search',
  //   },
  // ],
  defaultTitle: 'GBIF',
  // The languages should be synced with supportedLocales in graphql-api/src/helpers/sanitize-html.ts
  languages: [
    {
      code: 'en', // TODO, really ought to be en-GB, but while developing it is convinent to have developer english when text change
      label: 'English',
      default: true,
      textDirection: 'ltr',
    },
    {
      code: 'en-DK', // TODO, really ought to be en-GB, but while developing it is convinent to have developer english when text change
      label: 'Danglish',
      default: false,
      textDirection: 'ltr',
    },
    {
      code: 'fr',
      label: 'Français',
      default: false,
      textDirection: 'ltr',
      cmsLocale: 'fr', // what locale code to use when fetching data from the cms endpoints
    },
    {
      code: 'es',
      label: 'Español',
      default: false,
      textDirection: 'ltr',
      cmsLocale: 'es', // what locale code to use when fetching data from the cms endpoints
    },
    {
      code: 'ar',
      label: 'العربية',
      default: false,
      textDirection: 'rtl',
      reactIntlLocale: 'ar-SA',
    },
  ],
  occurrencePredicate: {
    type: 'and',
    predicates: [
      {
        type: 'range',
        key: 'year',
        value: {
          gte: '2012',
        },
      },
    ],
  },
  theme: {
    primary: '#4787fb', //'#69AA69',
    // primary: '#69AA69',
    stickyOffset: '40px',
  },
  openGraph: {
    site_name: 'GBIF',
  },
  OBISKey: 'ba0670b9-4186-41e6-8e70-f9cb3065551a',
  taiwanNodeidentifier: '239',
  linkToGbifOrg: true,
  datasetSearch: {
    excludedFilters: [],
    highlightedFilters: ['q', 'type', 'publishingOrg', 'license'],
    // defaultTableColumns: ['title', 'description', 'publisher', 'type', 'occurrenceCount', 'literatureCount'],
    // scope: {
    //   publishingCountry: ['DK'],
    // },
    queryType: 'V1',
  },
  collectionSearch: {
    queryType: 'V1',
    highlightedFilters: ['q', 'institutionKey'],
  },
  literatureSearch: {
    queryType: 'PREDICATE',
    highlightedFilters: ['q', 'year'],
  },
  occurrenceSearch: {
    queryType: 'PREDICATE',
    highlightedFilters: ['q', 'institutionKey'],
    availableTableColumns: ['country', 'coordinates', 'year', 'basisOfRecord', 'dataset'],
    defaultEnabledTableColumns: ['country', 'year', 'basisOfRecord', 'dataset'],
  },
};
