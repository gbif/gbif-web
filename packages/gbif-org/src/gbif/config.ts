import { InputConfig } from '@/contexts/config/config';
import { InvalidGbifEnvError, isGbifEnv } from '@/contexts/config/endpoints';

const gbifEnv = import.meta.env.PUBLIC_GBIF_ENV;
if (typeof gbifEnv !== 'string') throw new Error('Missing PUBLIC_GBIF_ENV env variable');
if (!isGbifEnv(gbifEnv)) throw new InvalidGbifEnvError(gbifEnv);

const baseUrl = import.meta.env.PUBLIC_BASE_URL;
if (typeof baseUrl !== 'string') throw new Error('Missing PUBLIC_BASE_URL env variable');

export const gbifConfig: InputConfig = {
  defaultTitle: 'GBIF',
  gbifEnv,
  // The languages should be synced with supportedLocales in graphql-api/src/helpers/sanitize-html.ts
  languages: [
    {
      code: 'en-DK',// TODO, really ought to be en-GB, but while developing it is convinent to have developer english when text change
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
  baseUrl,
  openGraph: {
    site_name: 'GBIF',
  },
  OBISKey: 'ba0670b9-4186-41e6-8e70-f9cb3065551a',
  taiwanNodeidentifier: '239',
  linkToGbifOrg: true,
};
