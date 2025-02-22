import crypto from 'crypto';
import stringify from 'json-stable-stringify';
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
  return `${truncatedText.slice(0, lastSpaceIndex)}…`;
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

function renameProperty(obj, from, to) {
  if (from in obj) {
    obj[to] = obj[from];
    delete obj[from];
  }
  return obj;
}

async function getOGImage({ homepage, timeoutMs = 5000 }) {
  if (!homepage) return null;

  try {
    const response = await fetch(homepage, {
      signal: AbortSignal.timeout(timeoutMs),
      headers: {
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-language':
          'en-US,en;q=0.9,es;q=0.8,fr;q=0.7,ar;q=0.6,zh;q=0.5,es-ES;q=0.4,da;q=0.3,ru;q=0.2,de-CH;q=0.1,de;q=0.1,ko;q=0.1',
        'cache-control': 'no-cache',
        pragma: 'no-cache',
        priority: 'u=0, i',
        'sec-ch-ua':
          '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-user': '?1',
        Referer: 'https://www.gbif.org',
      },
      body: null,
      method: 'GET',
    });
    if (response.status !== 200) return null;

    const html = await response.text();
    const ogImageMatch = html.match(
      /<meta.property="og:image"\s* content="([^"]+)".*>/,
    );
    const ogImage = ogImageMatch ? ogImageMatch[1] : null;
    return ogImage ?? null;
  } catch (error) {
    return null;
  }
}

const getFirstIIIFImage = ({ occurrence }) => {
  // return 'test';
  const multimediaExtension =
    occurrence?.extensions?.['http://rs.tdwg.org/ac/terms/Multimedia'];
  if (multimediaExtension) {
    const iiifUris = multimediaExtension
      .filter((e) => {
        return (
          e['http://purl.org/dc/elements/1.1/format'] ===
            'application/ld+json' &&
          e['http://rs.tdwg.org/ac/terms/serviceExpectation'] &&
          e['http://rs.tdwg.org/ac/terms/serviceExpectation'].toLowerCase() ===
            'iiif'
        );
      })
      .map((e) => {
        return e['http://rs.tdwg.org/ac/terms/accessURI'];
      });
    if (iiifUris.length > 0) {
      try {
        return `${
          iiifUris[0].split('://')[0]
        }://labs.gbif.org/mirador/?manifest=${iiifUris[0]}`;
      } catch (error) {
        return null;
      }
    }
    return null;
  }
  return null;
};

export function signJson(obj) {
  const jsonString = stringify(obj);
  const hmac = crypto.createHmac(
    'sha256',
    config.downloadMachineDescriptionSecret,
  );
  hmac.update(jsonString);
  return hmac.digest('hex');
}

export function verifyJson(obj, signature) {
  return signJson(obj) === signature;
}

export {
  createLocalizedGbifHref,
  excerpt,
  formattedCoordinates,
  getExcerpt,
  getFirstIIIFImage,
  getHtml,
  getOGImage,
  isNoneEmptyArray,
  isOccurrenceSequenced,
  objectToQueryString,
  renameProperty,
  simplifyUrlObjectKeys,
  translateContentfulResponse,
};
