import sanitizeHtml from 'sanitize-html';
import * as cheerio from 'cheerio';
import mdit from 'markdown-it';
import { decode } from 'html-entities';
import config from '#/config';
import mdAnchor from 'markdown-it-anchor';

export const standardTags = [
  "address", "article", "aside", "footer", "header", "h1", "h2", "h3", "h4",
  "h5", "h6", "hgroup", "main", "nav", "section", "blockquote", "dd", "div",
  "dl", "dt", "figcaption", "figure", "hr", "li", "main", "ol", "p", "pre",
  "ul", "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn",
  "em", "i", "kbd", "mark", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp",
  "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr", "caption",
  "col", "colgroup", "table", "tbody", "td", "tfoot", "th", "thead", "tr",
];
export const defaultAttributes = {
  a: ['href', 'name', 'target']
};

export const publishedTags = [
  "h1", "h2", "h3", "h4", "h5", "h6", "dl", "dt", "li", "main", "ol", "p", "pre",
  "ul", "a", "abbr", "b", "code", "em", "i", "span", "strong"
];

export const trustedTags = [...standardTags, 'iframe', 'img'];
export const trustedAttributes = {
  ...defaultAttributes,
  img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading']
};

const md = mdit({
  html: true,
  linkify: true,
  typographer: false,
  breaks: true,
});

// adding anchor headers to markdown would be nice, but the problem is the navbar offset
md.use(mdAnchor, {
  // slugify: function(str){return '_' + encodeURIComponent(format.getSlug(str))}, // option to add a custom slug function. I'm not sure how well the default works - we should test that on the vadious languages
});

function formattedCoordinates({ lat, lon }) {
  if (typeof lat !== 'number' || typeof lon !== 'number') return undefined;

  const la = Math.abs(lat).toFixed(2) + (lat < 0 ? 'S' : 'N');
  const lo = Math.abs(lon).toFixed(2) + (lon < 0 ? 'W' : 'E');
  return `${la}, ${lo}`;
}

const ggbnFields = [
  'Amplification',
  'Cloning'
];
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
    const ext =
      extensions[`http://rs.gbif.org/terms/1.0/DNADerivedData`];
    if (ext && ext.length > 0) return true;
  }

  // alas it isn't sequenced
  return false;
}

function getHtml(
  value,
  { allowedTags = ['a', 'p', 'i', 'ul', 'ol', 'li', 'strong'], allowedAttributes = defaultAttributes, inline, wrapTables } = {},
) {
  const options = { wrapTables };
  if (allowedTags) options.allowedTags = allowedTags;
  if (allowedAttributes) options.allowedAttributes = allowedAttributes;
  if (typeof value === 'string' || typeof value === 'number') {
    const dirty = inline ? md.renderInline(`${value}`) : md.render(`${value}`);
    const decoded = decode(dirty).replace(/\n/g, '');
    const dirtyV2 = md.renderInline(`${decoded}`);
    const clean = sanitize(dirtyV2, options);
    return clean;
  }
  return null;
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
  const shortenedKeys = keys.map(key => key.substring(key.lastIndexOf('/') + 1));
  const newObj = {};
  keys.forEach((k, i) => newObj[shortenedKeys[i]] = obj[k]);
  return newObj;
}

// This function will translate a contentful response to the requested locale
// If the requested locale is not available, it will default to english
// It will recursively translate all objects and arrays in the response
function translateContentfulResponse(source, locale) {
  // Handle translation of arrays
  if (Array.isArray(source)) {
    return source.map(item => translateContentfulResponse(item, locale))
  }

  // Handle translation of objects
  if (typeof source === 'object' && source !== null) {
    // If the field is localized, translate it to the requested locale or default to english
    const isLocalized = 'en-GB' in source;
    if (isLocalized) return translateContentfulResponse(source[locale] ?? source['en-GB'], locale);

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
  return truncatedText.slice(0, lastSpaceIndex) + '...';
}

function excerpt({ summary, body }, maxLength = 200) {
  if (summary != null) return getHtml(summary, { inline: false, allowedTags: [] });
  if (body == null) return;

  // Parse the body and remove all tags
  const bodyHtml = getHtml(body, { inline: false, allowedTags: [] });
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
  'ar': 'ar',
  'zh-Hant': 'zh-tw',
  'zh-Hans': 'zh',
  'fr': 'fr',
  'ru': 'ru',
  'es': 'es',
  'ja': 'ja',
  'pt': 'pt',
  'uk': 'uk',
  'ko': null, // Has no GBIF translation
  'pl': null, // Has no GBIF translation
};

function createLocalizedGbifHref(locale, path, id) {
  const gbifLocale = contentfulLocaleToGbifLocaleMap[locale];

  const url = [
    config.gbifLinkTargetOrigin,
    gbifLocale,
    path,
    id,
  ].filter(Boolean).join('/');

  return url;
}


function prefixLinkUrl(str = '') {
  if (typeof str === 'string') {
    str = (str + '').replace(/^http(s)?:\/\/www\.gbif((-dev)|(-uat))?\.org\//, `${config.gbifLinkTargetOrigin}/`);
    if (str.startsWith('/') && !str.startsWith('//')) {
      str = config.gbifLinkTargetOrigin + str;
    }
  }
  return str;
}

function sanitize(dirty, { allowedTags = standardTags, wrapTables } = {}) {
  dirty = dirty || '';
  let sanitized = sanitizeHtml(dirty, {
    allowedTags,
    allowedAttributes: false,
    allowedIframeHostnames: ['www.youtube.com', 'player.vimeo.com', 'vimeo.com'],
    transformTags: {
      'a': function (tagName, attr) {
        attr.href = prefixLinkUrl(attr.href);
        return {
          tagName,
          attribs: attr
        };
      },
      'img': function (tagName, attr) {
        attr.src = prefixLinkUrl(attr.src);
        return {
          tagName,
          attribs: attr
        };
      }
    }
  });
  if (!wrapTables) return sanitized;

  // else wrap tables in divs for easier styling
  // Load the HTML content into Cheerio
  const $ = cheerio.load(sanitized, null, false);
  
  // Find all table tags and wrap them in a div
  $('table').each((index, element) => {
    const table = $(element);
    const div = $('<div class="gbif-table-wrapper"></div>');

    // Replace the table with the wrapped div
    table.replaceWith(div.append(table.clone()));
  });

  // Get the modified HTML
  const modifiedHtml = $.html();

  return modifiedHtml;
}

export { formattedCoordinates, isOccurrenceSequenced, getHtml, getExcerpt, simplifyUrlObjectKeys, translateContentfulResponse, excerpt, objectToQueryString, createLocalizedGbifHref };
