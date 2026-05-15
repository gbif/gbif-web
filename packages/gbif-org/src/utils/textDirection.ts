/**
 * Matches the first strongly directional character to determine text direction,
 * replicating the behaviour of HTML's `dir="auto"`.
 *
 * RTL ranges cover Hebrew, Arabic, Syriac, Thaana, N'Ko, Samaritan, Mandaic,
 * Arabic Extended-A, and their presentation forms, plus directional control characters.
 */
const RTL_CHAR =
  /[\u0590-\u07FF\u0800-\u085F\u08A0-\u08FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]/;

/**
 * Returns `'rtl'` if the first strongly directional character in `text` is
 * right-to-left, otherwise returns `'ltr'`. Falls back to `'ltr'` when no
 * strongly directional character is found (same default as `dir="auto"`).
 */
export function getTextDirection(text?: string | null): 'ltr' | 'rtl' {
  if (!text) return 'ltr';
  for (const char of text) {
    if (RTL_CHAR.test(char)) return 'rtl';
    // Any letter that is not in the RTL ranges above is a strong LTR character.
    if (/\p{L}/u.test(char)) return 'ltr';
  }
  return 'ltr';
}

/** Convenience wrapper that returns `true` when the text is RTL. */
export function isRTL(text: string): boolean {
  return getTextDirection(text) === 'rtl';
}
