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

const removeNewLinesOutsidePreAndCodeTags = (input) => {
  // Step 1: Protect <pre>, <code>, <textarea> blocks (tags + contents) with a TAG-SHAPED placeholder
  const protectedBlocks = [];
  let s = input.replace(/<(pre|code)\b[^>]*>[\s\S]*?<\/\1>/gi, (match) => {
    const i = protectedBlocks.push(match) - 1;
    return `<x-protected data-i="${i}"></x-protected>`;
  });

  // Step 2: Remove/normalize newlines only in text nodes outside protected blocks
  // - If the captured text has any non-whitespace, replace newlines with a single space (keeps words from sticking together)
  // - If it's only whitespace (e.g., the gap between tags), remove newlines entirely
  s = s.replace(/>([^<]+)</g, (m, text) => {
    const hasNonWS = /\S/.test(text);
    const cleaned = hasNonWS
      ? text.replace(/\n+/g, ' ')
      : text.replace(/\n+/g, '');
    return `>${cleaned}<`;
  });

  // Step 3: Restore protected blocks (tags + contents intact)
  s = s.replace(
    /<x-protected data-i="(\d+)"><\/x-protected>/g,
    (_, i) => protectedBlocks[+i],
  );

  // Optional: remove trailing newlines from the whole string (outside-anything)
  s = s.replace(/\n+$/g, '');
  return s;
};

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

    return removeNewLinesOutsidePreAndCodeTags(clean);
  }
  return null;
}

export default { getHtml };
