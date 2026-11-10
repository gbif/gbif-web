import pkg from 'isomorphic-dompurify';
const { sanitize, addHook } = pkg;

// Links that open in another tab always get rel="noopener noreferrer", so the opened page can't reach back
// to this one through window.opener.
addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.hasAttribute('target')) {
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

// Links in rich text may only point to GBIF sites, GitHub or relative paths.
export const ALLOWED_URI_REGEXP =
  /^(?:(?:https?:)?\/\/(?:www\.)?(?:gbif(?:-(?:dev|test|staging))?\.org|api\.gbif(?:-(?:dev|test|staging))?\.org|data-blog\.gbif\.org|discourse\.gbif\.org|github\.com)|\/)/i;

// Scientific names, labels and titles from publishers and other sources we don't control. Only inline
// formatting is kept (names use <i> for the italic parts), and no attributes at all.
export const INLINE_SANITIZE_OPTIONS: DOMPurify.Config = {
  ALLOWED_TAGS: ['i', 'em', 'b', 'strong', 'span', 'sup', 'sub'],
  ALLOWED_ATTR: [],
};

// Image captions, typically a credit with a link to the photographer or source.
export const CAPTION_SANITIZE_OPTIONS: DOMPurify.Config = {
  ALLOWED_TAGS: ['a', 'i', 'em', 'b', 'strong', 'span', 'br'],
  ALLOWED_ATTR: ['href', 'target', 'rel'],
};

// Short rich text such as publisher-provided values and translated messages. Only link attributes are kept, so
// style, class and id can't be used to restyle or overlay the page.
export const DEFAULT_SANITIZE_OPTIONS: DOMPurify.Config = {
  ALLOWED_TAGS: ['a', 'strong', 'em', 'p', 'br', 'code', 'pre'],
  ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
};

// Most names and labels are plain text, or plain text with bare <i> tags. For those DOMPurify returns the input
// unchanged, but on the server every call goes through jsdom (about 0.2 ms per name), so they skip it. Only
// characters the HTML parser keeps as they are, and balanced, correctly nested allowed tags without attributes,
// take this path; anything else is sanitised as normal.
const INLINE_TOKEN = /<(\/?)(i|em|b|strong|span|sup|sub)>|[^<>&\u0000\r\u00a0]+/gy;

export function isPlainInlineHtml(html: string): boolean {
  const open: string[] = [];
  INLINE_TOKEN.lastIndex = 0;
  let match: RegExpExecArray | null;
  while (INLINE_TOKEN.lastIndex < html.length && (match = INLINE_TOKEN.exec(html))) {
    const [, closing, tag] = match;
    if (!tag) continue;
    if (!closing) open.push(tag);
    else if (open.pop() !== tag) return false;
  }
  return INLINE_TOKEN.lastIndex === html.length && open.length === 0;
}

export function sanitizeHtml(
  dirtyHtml: string,
  sanitizeOptions: DOMPurify.Config = INLINE_SANITIZE_OPTIONS
): string {
  if (sanitizeOptions === INLINE_SANITIZE_OPTIONS && isPlainInlineHtml(dirtyHtml)) return dirtyHtml;

  // The result is injected as an HTML string, so DOM return modes are never valid here.
  return sanitize(dirtyHtml, {
    ...sanitizeOptions,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
  }) as string;
}
