import { LanguageOption } from './config';

// define list of LanguageOption[]
const languageOptions: LanguageOption[] = [
  {
    code: 'en',
    localeCode: 'en',
    label: 'English',
    default: true,
    textDirection: 'ltr',
    iso3LetterCode: 'eng',
    cmsLocale: 'en-GB',
    gbifOrgLocalePrefix: '',
    mapTileLocale: 'en',
  },
  {
    code: 'nonsense',
    localeCode: 'en-ZZ',
    label: 'Test',
    default: false,
    textDirection: 'ltr',
    cmsLocale: 'es',
    reactIntlLocale: 'ar-SA',
    gbifOrgLocalePrefix: '',
    grSciCollLocalePrefix: '',
  },
  {
    code: 'danglish', // TODO, developer english.  while developing it is convinent to have developer english when text change so taht we can see changes immeadiately
    localeCode: 'en-DK',
    label: 'Danglish',
    default: false,
    textDirection: 'ltr',
    gbifOrgLocalePrefix: '',
    grSciCollLocalePrefix: '',
    mapTileLocale: 'en',
  },
  {
    code: 'fr',
    localeCode: 'fr',
    label: 'Français',
    default: false,
    textDirection: 'ltr',
    cmsLocale: 'fr', // what locale code to use when fetching data from the cms endpoints
    iso3LetterCode: 'fra',
    vocabularyLocale: 'fr-FR',
    gbifOrgLocalePrefix: '/fr',
    grSciCollLocalePrefix: '',
    mapTileLocale: 'fr',
  },
  {
    code: 'es',
    localeCode: 'es',
    label: 'Español',
    default: false,
    textDirection: 'ltr',
    cmsLocale: 'es', // what locale code to use when fetching data from the cms endpoints
    vocabularyLocale: 'es-ES', // what locale code to use when fetching data from the vocabulary endpoints
    iso3LetterCode: 'spa',
    gbifOrgLocalePrefix: '/es',
    grSciCollLocalePrefix: '/es',
    mapTileLocale: 'es',
  },
  {
    code: 'de',
    localeCode: 'de',
    label: 'Deutsch',
    default: false,
    textDirection: 'ltr',
    reactIntlLocale: 'de-DE',
    iso3LetterCode: 'deu',
    vocabularyLocale: 'de-DE',
    gbifOrgLocalePrefix: '',
    grSciCollLocalePrefix: '',
    mapTileLocale: 'de',
  },
  {
    code: 'ar',
    localeCode: 'ar',
    label: 'العربية',
    default: false,
    textDirection: 'rtl',
    reactIntlLocale: 'ar-SA',
    iso3LetterCode: 'ara',
    gbifOrgLocalePrefix: '/ar',
    grSciCollLocalePrefix: '',
    mapTileLocale: 'ar',
  },
];

const enabledLocales = import.meta.env.PUBLIC_ENABLED_LANGUAGES.split(',');
export const languagesOptions = enabledLocales
  .map((code: string) => languageOptions.find((l) => l.code === code))
  .filter(Boolean) as LanguageOption[];
