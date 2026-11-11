import { INLINE_SANITIZE_OPTIONS, sanitizeHtml } from '@/utils/sanitizeHtml';
import React, { useMemo } from 'react';

type Props = {
  // HTML from a source we don't fully trust. It is always sanitised before it is rendered.
  html?: string | null;
  // Shown as plain text when there is no html. Never treated as HTML.
  fallback?: React.ReactNode;
  sanitizeOptions?: DOMPurify.Config;
  as?: 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'p';
} & Omit<React.HTMLAttributes<HTMLElement>, 'dangerouslySetInnerHTML' | 'children'>;

/**
 * Render a string of HTML, sanitised. Defaults to inline formatting only (scientific names, titles,
 * labels). Use this instead of dangerouslySetInnerHTML for anything that doesn't come from our own CMS.
 */
export function Html({
  html,
  fallback,
  sanitizeOptions = INLINE_SANITIZE_OPTIONS,
  as: Tag = 'span',
  ...props
}: Props) {
  const clean = useMemo(
    () => (typeof html === 'string' && html !== '' ? sanitizeHtml(html, sanitizeOptions) : null),
    [html, sanitizeOptions]
  );

  // html that is nothing but removed markup (e.g. only an <img>) counts as empty, so the fallback is shown
  if (clean !== null && clean.trim() !== '') {
    return <Tag {...props} dangerouslySetInnerHTML={{ __html: clean }} />;
  }
  if (fallback === undefined || fallback === null || fallback === '') return null;
  return <Tag {...props}>{fallback}</Tag>;
}
