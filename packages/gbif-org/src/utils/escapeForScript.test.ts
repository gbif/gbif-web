import { describe, expect, it } from 'vitest';
import { escapeForScript } from './escapeForScript';

describe('escapeForScript', () => {
  it('stops a JSON-LD string from closing the script element', () => {
    const jsonLd = JSON.stringify(
      {
        '@type': 'Dataset',
        name: 'Harmless title</script><img src=x onerror=alert(1)>',
      },
      null,
      2,
    );
    const output = escapeForScript(jsonLd);

    expect(output).not.toContain('</script');
    expect(output).not.toContain('<');
    expect(output).toContain('\\u003c/script>');
  });

  it('escapes U+2028 and U+2029 without changing the decoded value', () => {
    const value = { name: `a\u2028b\u2029c</script>` };
    const output = escapeForScript(JSON.stringify(value));

    expect(output).not.toContain('\u2028');
    expect(output).not.toContain('\u2029');
    expect(JSON.parse(output)).toEqual(value);
  });

  it('keeps valid JSON that round-trips to the original object', () => {
    const value = {
      '@context': 'https://schema.org',
      description: 'Use <b>tags</b> & "quotes" \\ backslashes',
      list: ['<!-- comment -->', 'plain'],
    };
    expect(JSON.parse(escapeForScript(JSON.stringify(value, null, 2)))).toEqual(value);
  });

  it('leaves text without unsafe characters unchanged', () => {
    const text = JSON.stringify({ name: 'Plain title & more' });
    expect(escapeForScript(text)).toBe(text);
  });
});
