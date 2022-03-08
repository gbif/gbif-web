const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const md = require('markdown-it')({
  html: true, 
  linkify: false, 
  typographer: false, 
  breaks: true
});
md.linkify.tlds(['org', 'com'], false);

function formattedCoordinates({lat, lon}) {
  if (typeof lat !== 'number' || typeof lon !== 'number') return;
  
  var la = Math.abs(lat).toFixed(2) + (lat < 0 ? 'S' : 'N');
  var lo = Math.abs(lon).toFixed(2) + (lon < 0 ? 'W' : 'E');
  return la + ', ' + lo;
}

const ggbnFields = ['Amplification', 'MaterialSample', 'Permit', 'Preparation', 'Preservation'];
function isOccurrenceSequenced({occurrence, verbatim}) {
  // lets hope that publisher do not put "no" into this
  if (occurrence.associatedSequences) return true;

  // if no extensions defined then it isn't sequenced
  const extensions = verbatim.extensions;
  if (typeof extensions !== 'object') return false;

  // if there are GGBN extensions in use, then it is sequenced
  for (var i = 0; i < ggbnFields.length; i++) {
    var ext = extensions['http://data.ggbn.org/schemas/ggbn/terms/' + ggbnFields[i]];
    if (ext && ext.length > 0) return true;
  }

  // alas it isn't sequenced
  return false;
}

function getHtml(value, {allowedTags = ['a', 'p', 'i', 'br', 'ul', 'ol', 'li'], inline } = {}) {
  let options = {};
  if (allowedTags) options.ALLOWED_TAGS = allowedTags;
  if (typeof value === 'string' || typeof value === 'number') {
    const dirty = inline ? md.renderInline('' + value) : md.render('' + value);
    const clean = DOMPurify.sanitize(dirty, options);
    return clean;
  } else {
    return null;
  }
}

module.exports = {
  formattedCoordinates,
  isOccurrenceSequenced,
  getHtml
}