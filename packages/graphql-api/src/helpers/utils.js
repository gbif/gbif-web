import createDOMPurify from 'dompurify';
import mdit from 'markdown-it';
import { JSDOM } from 'jsdom';

const { window } = new JSDOM('');
const DOMPurify = createDOMPurify(window);

const md = mdit({
  html: true,
  linkify: false,
  typographer: false,
  breaks: true,
});
md.linkify.tlds(['org', 'com'], false);

function formattedCoordinates({ lat, lon }) {
  if (typeof lat !== 'number' || typeof lon !== 'number') return undefined;

  const la = Math.abs(lat).toFixed(2) + (lat < 0 ? 'S' : 'N');
  const lo = Math.abs(lon).toFixed(2) + (lon < 0 ? 'W' : 'E');
  return `${la}, ${lo}`;
}

const ggbnFields = [
  'Amplification',
  'MaterialSample',
  'Permit',
  'Preparation',
  'Preservation',
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

  // alas it isn't sequenced
  return false;
}

function getHtml(
  value,
  { allowedTags = ['a', 'p', 'i', 'br', 'ul', 'ol', 'li'], inline } = {},
) {
  const options = {};
  if (allowedTags) options.ALLOWED_TAGS = allowedTags;
  if (typeof value === 'string' || typeof value === 'number') {
    const dirty = inline ? md.renderInline(`${value}`) : md.render(`${value}`);
    const clean = DOMPurify.sanitize(dirty, options);
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

export { formattedCoordinates, isOccurrenceSequenced, getHtml, getExcerpt, simplifyUrlObjectKeys };
