import pkg from 'isomorphic-dompurify';
const { sanitize } = pkg;

// Links in rich text may only point to GBIF sites, GitHub or relative paths.
export const ALLOWED_URI_REGEXP =
  /^(?:(?:https?:)?\/\/(?:www\.)?(?:gbif(?:-(?:dev|test|staging))?\.org|api\.gbif(?:-(?:dev|test|staging))?\.org|data-blog\.gbif\.org|discourse\.gbif\.org|github\.com)|\/)/i;

// Scientific names, labels and titles from publishers and other sources we don't control. Only inline
// formatting is kept (names use <i> for the italic parts), and no attributes at all.
export const INLINE_SANITIZE_OPTIONS: DOMPurify.Config = {
  ALLOWED_TAGS: ['i', 'em', 'b', 'strong', 'span', 'sup', 'sub'],
  ALLOWED_ATTR: [],
};

// Short rich text such as descriptions and translated messages.
export const DEFAULT_SANITIZE_OPTIONS: DOMPurify.Config = {
  ALLOWED_TAGS: ['a', 'strong', 'em', 'p', 'br', 'code', 'pre'],
};

export function sanitizeHtml(
  dirtyHtml: string,
  sanitizeOptions: DOMPurify.Config = INLINE_SANITIZE_OPTIONS
): string {
  // The result is injected as an HTML string, so DOM return modes are never valid here.
  return sanitize(dirtyHtml, {
    ...sanitizeOptions,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
  }) as string;
}
