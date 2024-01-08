import { InputConfig } from '@/contexts/config/config';
import { InvalidGbifEnvError, isGbifEnv } from '@/contexts/config/endpoints';

const gbifEnv = import.meta.env.PUBLIC_GBIF_ENV;
if (typeof gbifEnv !== 'string') throw new Error('PUBLIC_GBIF_ENV GBIF_ENV env variable');
if (!isGbifEnv(gbifEnv)) throw new InvalidGbifEnvError(gbifEnv);

export const gbifConfig: InputConfig = {
  defaultTitle: 'GBIF',
  gbifEnv,
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
      cmsLocale: 'fr', // what locale code to use when fetching data from the cms endpoints
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
      primary: '#ED1C24',
      // primaryForeground: 'black',
    },
    borderRadius: 4,
  },
};
