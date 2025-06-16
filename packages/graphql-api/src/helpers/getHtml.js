import mdit from 'markdown-it';
import mdAnchor from 'markdown-it-anchor';
import mdVideo from 'markdown-it-video';
import { sanitizeHtml } from './sanitize-html';

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

// Add support for video embedding
md.use(mdVideo, {
  youtube: { width: 640, height: 390 },
  vimeo: { width: 500, height: 281 },
});

export function getHtml(
  value,
  {
    allowedTags,
    allowedAttributes,
    inline = false,
    wrapTables = false,
    trustLevel = 'untrusted',
    locale,
  } = {},
) {
  const options = { wrapTables, trustLevel, locale };
  if (allowedTags) options.allowedTags = allowedTags;
  if (allowedAttributes) options.allowedAttributes = allowedAttributes;
  if (typeof value === 'string' || typeof value === 'number') {
    const dirty = inline ? md.renderInline(`${value}`) : md.render(`${value}`);
    const clean = sanitizeHtml(dirty, options);
    // remove newlines
    return clean.replace(/\n/g, '');
  }
  return null;
}

export default { getHtml };
