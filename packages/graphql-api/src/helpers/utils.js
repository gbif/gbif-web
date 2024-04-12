import config from '../config';
import { getHtml } from './getHtml';

function formattedCoordinates({ lat, lon }) {
  if (typeof lat !== 'number' || typeof lon !== 'number') return undefined;

  const la = Math.abs(lat).toFixed(2) + (lat < 0 ? 'S' : 'N');
  const lo = Math.abs(lon).toFixed(2) + (lon < 0 ? 'W' : 'E');
  return `${la}, ${lo}`;
}

const ggbnFields = ['Amplification', 'Cloning'];
function isOccurrenceSequenced({ occurrence, verbatim }) {
  // lets hope that publisher do not put "no" into this
  if (occurrence.associatedSequences) return true;

  // if no extensions defined then it isn't sequenced
  const { extensions } = verbatim;
  if (typeof extensions !== 'object') return false;

  // if there are GGBN extensions in use, then it is sequenced
  for (let i = 0; i < ggbnFields.length; i += 1) {
    const ext =
      extensions[`http://data.ggbn.org/schemas/ggbn/terms/${ggbnFields[i]}`];
    if (ext && ext.length > 0) return true;
  }

  // if the DNADerivedData extension in use, then it is sequenced
  for (let i = 0; i < ggbnFields.length; i += 1) {
    const ext = extensions[`http://rs.gbif.org/terms/1.0/DNADerivedData`];
    if (ext && ext.length > 0) return true;
  }

  // alas it isn't sequenced
  return false;
}

function getExcerpt({ strings = [], length = 200 }) {
  const concatenatedText = strings.filter((x) => x).join('. ');
  let plainText = getHtml(concatenatedText, { allowedTags: [], inline: true });
  if (plainText.length > length)
    plainText = `${plainText.substring(0, length)}...`;
  return {
    plainText,
  };
}

// the purpose is to simplify key names that are urls to only take the last part after the slash
function simplifyUrlObjectKeys(obj) {
  const keys = Object.keys(obj);
  const shortenedKeys = keys.map((key) =>
    key.substring(key.lastIndexOf('/') + 1),
  );
  const newObj = {};
  keys.forEach((k, i) => (newObj[shortenedKeys[i]] = obj[k]));
  return newObj;
}

// This function will translate a contentful response to the requested locale
// If the requested locale is not available, it will default to english
// It will recursively translate all objects and arrays in the response
function translateContentfulResponse(source, locale) {
  // Handle translation of arrays
  if (Array.isArray(source)) {
    return source.map((item) => translateContentfulResponse(item, locale));
  }

  // Handle translation of objects
  if (typeof source === 'object' && source !== null) {
    // If the field is localized, translate it to the requested locale or default to english
    const isLocalized = 'en-GB' in source;
    if (isLocalized)
      return translateContentfulResponse(
        source[locale] ?? source['en-GB'],
        locale,
      );

    // If the field is not localized, translate its children
    return Object.entries(source).reduce((acc, [key, value]) => {
      acc[key] = translateContentfulResponse(value, locale);
      return acc;
    }, {});
  }

  // All other data types are returned as-is
  return source;
}

function truncateText(sourceText, maxLength) {
  if (sourceText.length <= maxLength) return sourceText;
  const truncatedText = sourceText.slice(0, maxLength);
  const lastSpaceIndex = truncatedText.lastIndexOf(' ');
  return truncatedText.slice(0, lastSpaceIndex) + '…';
}

function excerpt({ summary, body }, { maxLength = 200, locale } = {}) {
  if (summary != null)
    return getHtml(summary, { inline: false, allowedTags: [], locale });
  if (body == null) return;

  // Parse the body and remove all tags
  const bodyHtml = getHtml(body, { inline: false, allowedTags: [], locale });
  return truncateText(bodyHtml, maxLength);
}

function objectToQueryString(params) {
  const urlParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      for (const element of value) {
        urlParams.append(key, String(element));
      }
    } else {
      urlParams.append(key, String(value));
    }
  }

  return urlParams.toString();
}

const contentfulLocaleToGbifLocaleMap = {
  'en-GB': null,
  ar: 'ar',
  'zh-Hant': 'zh-tw',
  'zh-Hans': 'zh',
  fr: 'fr',
  ru: 'ru',
  es: 'es',
  ja: 'ja',
  pt: 'pt',
  uk: 'uk',
  ko: null, // Has no GBIF translation
  pl: null, // Has no GBIF translation
};

function createLocalizedGbifHref(locale, path, id) {
  const gbifLocale = contentfulLocaleToGbifLocaleMap[locale];

  const url = [config.gbifLinkTargetOrigin, gbifLocale, path, id]
    .filter(Boolean)
    .join('/');

  return url;
}

function isNoneEmptyArray(source) {
  return source != null && Array.isArray(source) && source.length > 0;
}

export {
  formattedCoordinates,
  isOccurrenceSequenced,
  getHtml,
  getExcerpt,
  simplifyUrlObjectKeys,
  translateContentfulResponse,
  excerpt,
  objectToQueryString,
  createLocalizedGbifHref,
  isNoneEmptyArray,
};
