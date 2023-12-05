import { Config } from '@/contexts/config';

const graphqlEndpoint = import.meta.env.PUBLIC_GRAPHQL_ENDPOINT;
if (typeof graphqlEndpoint !== 'string') {
  throw new Error('Missing PUBLIC_GRAPHQL_ENDPOINT env variable');
}

export const gbifConfig: Config = {
  defaultTitle: 'GBIF',
  graphqlEndpoint,
  languages: [
    {
      code: 'en',
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
      cmsLocale: 'fr',// what locale code to use when fetching data from the cms endpoints
    },
    {
      code: 'ar',
      label: 'العربية',
      default: false,
      textDirection: 'rtl',
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
    colors: {
      primary: 'hsl(104 57.0%	36.5%)',
      // primaryForeground: 'black',
    },
    borderRadius: 0.5,
  },
};
