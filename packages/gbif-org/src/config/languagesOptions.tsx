import { LanguageOption } from './config';

// define list of LanguageOption[]
const languageOptions: LanguageOption[] = [
  {
    code: 'en',
    label: 'English',
    default: true,
    textDirection: 'ltr',
  },
  {
    code: 'en-ZZ',
    label: 'Test',
    default: false,
    textDirection: 'ltr',
    cmsLocale: 'es',
    reactIntlLocale: 'ar-SA',
  },
  {
    code: 'en-DK', // TODO, developer english.  while developing it is convinent to have developer english when text change so taht we can see changes immeadiately
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
    vocabularyLocale: 'es-ES', // what locale code to use when fetching data from the vocabulary endpoints
  },
  {
    code: 'ar',
    label: 'العربية',
    default: false,
    textDirection: 'rtl',
    reactIntlLocale: 'ar-SA',
  },
];

const enabledLocales = import.meta.env.PUBLIC_ENABLED_LANGUAGES.split(',');
export const languagesOptions = enabledLocales
  .map((code: string) => languageOptions.find((l) => l.code === code))
  .filter(Boolean) as LanguageOption[];
