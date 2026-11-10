// "<", U+2028 and U+2029, matched by code point so this source file stays plain ASCII.
const UNSAFE_SCRIPT_CHARS = new RegExp(`[<${String.fromCharCode(0x2028)}${String.fromCharCode(0x2029)}]`, 'g');

/**
 * Make text safe to place as the content of an inline <script> element.
 *
 * "<" is escaped so the text can never contain "</script>" or "<!--" and close the element early.
 * U+2028 and U+2029 are escaped too, since they are line terminators in older JavaScript parsers.
 * The escapes are \uXXXX sequences, so the result still decodes to the original text: valid JSON
 * stays valid JSON (and JSON-LD), and a JavaScript string literal keeps its value.
 *
 * @param {string} text
 * @returns {string}
 */
export function escapeForScript(text) {
  return text.replace(
    UNSAFE_SCRIPT_CHARS,
    /** @param {string} char */
    (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`,
  );
}

export default escapeForScript;
