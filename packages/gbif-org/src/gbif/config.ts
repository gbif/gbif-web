import { Config } from '@/contexts/config/config';
import {
  GbifEnv,
  getDefaultEndpointsBasedOnGbifEnv,
  InvalidGbifEnvError,
  isGbifEnv,
} from '@/contexts/config/endpoints';
import commandLineArgs from 'command-line-args';
import { merge } from 'ts-deepmerge';

// The cli/env options
type Options = {
  gbifEnv: GbifEnv;
  baseUrl: string;
  graphqlEndpoint: string;
  // When running e2e tests, we need a separate endpoint for the server and client as the server needs the endpoint in on the
  // internal docker network and the client needs the endpoint on the host machine
  graphqlEndpointServer: string;
  graphqlEndpointClient: string;
  translationsEntryEndpoint: string;
  countEndpoint: string;
  formsEndpoint: string;
  formsEndpointServer: string;
  formsEndpointClient: string;
  v1Endpoint: string;
};

// Extract config options from the command line arguments
const cliOptions = [
  { name: 'gbifEnv', type: String },
  { name: 'baseUrl', type: String },
  { name: 'graphqlEndpoint', type: String },
  { name: 'graphqlEndpointServer', type: String },
  { name: 'graphqlEndpointClient', type: String },
  { name: 'translationsEntryEndpoint', type: String },
  { name: 'countEndpoint', type: String },
  { name: 'formsEndpoint', type: String },
  { name: 'formsEndpointServer', type: String },
  { name: 'formsEndpointClient', type: String },
  { name: 'v1Endpoint', type: String },
];

const cliConfig = commandLineArgs(cliOptions, { partial: true }) as Partial<Options>;

// Extract config options from the environment variables
const envConfig = {
  gbifEnv: import.meta.env.PUBLIC_GBIF_ENV,
  baseUrl: import.meta.env.PUBLIC_BASE_URL,
  graphqlEndpoint: import.meta.env.PUBLIC_GRAPHQL_ENDPOINT,
  translationsEntryEndpoint: import.meta.env.PUBLIC_TRANSLATIONS_ENTRY_ENDPOINT,
  countEndpoint: import.meta.env.PUBLIC_COUNT_ENDPOINT,
  formsEndpoint: import.meta.env.PUBLIC_FORMS_ENDPOINT,
  v1Endpoint: import.meta.env.PUBLIC_V1_ENDPOINT,
} as Partial<Options>;

// Validate that the required config options are present and valid
const gbifEnv = cliConfig.gbifEnv || envConfig.gbifEnv;
if (!gbifEnv) throw new Error('Missing PUBLIC_GBIF_ENV env variable');
if (!isGbifEnv(gbifEnv)) throw new InvalidGbifEnvError(gbifEnv);

const baseUrl = cliConfig.baseUrl || envConfig.baseUrl;
if (!baseUrl) throw new Error('Missing PUBLIC_BASE_URL env variable');

// Merge the config based on the priority order: CLI > ENV > default
const options = merge.withOptions(
  { allowUndefinedOverrides: false },
  getDefaultEndpointsBasedOnGbifEnv(gbifEnv),
  envConfig,
  cliConfig
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
  defaultTitle: 'GBIF',
  // The languages should be synced with supportedLocales in graphql-api/src/helpers/sanitize-html.ts
  languages: [
    {
      code: 'en-DK', // TODO, really ought to be en-GB, but while developing it is convinent to have developer english when text change
      label: 'English',
      default: true,
      textDirection: 'ltr',
    },
    {
      code: 'da',
      label: 'Dansk',
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
  // occurrencePredicate: undefined,
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
    // primary: '#4787fb',//'#69AA69',
    primary: '#69AA69',
    stickyOffset: '40px',
  },
  openGraph: {
    site_name: 'GBIF',
  },
  OBISKey: 'ba0670b9-4186-41e6-8e70-f9cb3065551a',
  taiwanNodeidentifier: '239',
  linkToGbifOrg: true,
};
