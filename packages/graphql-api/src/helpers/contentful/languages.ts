type Language = {
    code: string;
    name: string;
    default: boolean;
    fallbackCode: string | null;
}

// This config is extracted from the Contentful API. It should be updated if the languages change.
// https://cdn.contentful.com/spaces/{SPACE}/environments/{environment}/locales?access_token={ACCESS_TOKEN}
const languages: Language[] = [
    {
        "code": "en-GB",
        "name": "U.K. English",
        "default": true,
        "fallbackCode": null,
    },
    {
        "code": "ru",
        "name": "Russian",
        "default": false,
        "fallbackCode": "en-GB",
    },
    {
        "code": "es",
        "name": "Spanish",
        "default": false,
        "fallbackCode": "en-GB",
    },
    {
        "code": "ar",
        "name": "Arabic",
        "default": false,
        "fallbackCode": "en-GB",
    },
    {
        "code": "fr",
        "name": "French",
        "default": false,
        "fallbackCode": "en-GB",
    },
    {
        "code": "pt",
        "name": "Portuguese",
        "default": false,
        "fallbackCode": "en-GB",
    },
    {
        "code": "zh-Hans",
        "name": "Chinese (Simplified)",
        "default": false,
        "fallbackCode": "en-GB",
    },
    {
        "code": "nl",
        "name": "Dutch",
        "default": false,
        "fallbackCode": "en-GB",
    },
    {
        "code": "zh-Hant",
        "name": "Chinese (Traditional)",
        "default": false,
        "fallbackCode": "en-GB",
    },
    {
        "code": "ja",
        "name": "Japanese",
        "default": false,
        "fallbackCode": "en-GB",
    },
    {
        "code": "ko",
        "name": "Korean",
        "default": false,
        "fallbackCode": "en-GB",
    },
    {
        "code": "uk",
        "name": "Ukrainian",
        "default": false,
        "fallbackCode": "en-GB",
    },
    {
        "code": "pl",
        "name": "Polish",
        "default": false,
        "fallbackCode": "en-GB",
    }
]

const defaultLanguage = languages.find(l => l.default);
if (defaultLanguage == null) throw new Error("There is no default language");

export function pickLanguage<T>(data: Record<string, T>, locale?: string): T {
    // If no language is specified, return the default translation
    if (locale == null) return data[defaultLanguage!.code];

    // Validate the language
    const language = languages.find(l => l.code === locale);
    if (language == null) {
        throw new Error(`The language ${locale} is not supported. The available languages are: ${languages.map(l => `${l.name} (${l.code})`).join(', ')}`);
    }

    // Try to get the specified translation
    if (data[language.code] != null) return data[language.code];

    // Try to get the fallback translation
    if (language.fallbackCode != null && data[language.fallbackCode] != null) return data[language.fallbackCode];
  
    // return the default translation
    return data[defaultLanguage!.code];
  }