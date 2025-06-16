import { sanitize } from 'isomorphic-dompurify';

export const stripTags = (html: string) => {
  const clean = sanitize(html);
  return clean.replace(/<\/?[^>]+(>|$)/g, '');
};
