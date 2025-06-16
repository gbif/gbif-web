import pkg from 'isomorphic-dompurify';
const { sanitize } = pkg;
export const stripTags = (html: string) => {
  const clean = sanitize(html);
  return clean.replace(/<\/?[^>]+(>|$)/g, '');
};
