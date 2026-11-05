/* eslint-env mocha */
import assert from 'assert';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { injectIntoTemplate } from '@/middleware/graphqlExplorer';

const template = fs.readFileSync(path.join(__dirname, '../../public/graphql-sandbox.html'), 'utf8');

// Render the page, take the inline script and run it up to the point where the editor would be
// rendered. Returns what the page stored in localStorage and whether anything else was called.
function runPage(query: string, variables: string) {
  const html = injectIntoTemplate(template, query, variables);
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  assert.strictEqual(scripts.length, 1, 'expected exactly one inline script');

  const stored: Record<string, string> = {};
  let alerted = false;
  const stop = new Error('stop');
  const context = vm.createContext({
    window: {
      localStorage: {
        setItem: (k: string, v: string) => {
          stored[k] = v;
        },
      },
    },
    alert: () => {
      alerted = true;
    },
    ReactDOM: {
      createRoot: () => {
        throw stop;
      },
    },
    document: { getElementById: () => null },
  });
  try {
    vm.runInContext(scripts[0], context);
  } catch (err) {
    if (err !== stop) throw err;
  }
  return { stored, alerted };
}

describe('graphqlExplorer injectIntoTemplate', () => {
  /* eslint-disable no-template-curly-in-string -- these are payloads, not templates */
  const cases: Array<[string, string, string]> = [
    ['a plain query', '{taxon(key:1){scientificName}}', '{\n  "a": 1\n}'],
    ['template literal syntax', '${alert(1)}', '`${alert(1)}`'],
    ['quotes and backslashes', `"'\\"`, '\\'],
    ['a closing script tag', '</script><script>alert(1)</script>', '<!--'],
    ['replacement patterns', "$& $' $` $1", '$$'],
    ['line and paragraph separators', 'a\u2028b\u2029c', '\u2028'],
    ['the variables placeholder in the query', 'INJECTED_VARIABLES', '+alert(1)+'],
    ['the query placeholder in the variables', '+alert(1)+', 'INJECTED_QUERY'],
    ['both placeholders in both values', 'INJECTED_QUERY INJECTED_VARIABLES', 'INJECTED_VARIABLES INJECTED_QUERY'],
  ];
  /* eslint-enable no-template-curly-in-string */

  cases.forEach(([name, query, variables]) => {
    it(`stores ${name} verbatim without running it`, () => {
      const { stored, alerted } = runPage(query, variables);
      assert.strictEqual(alerted, false);
      assert.strictEqual(stored['graphiql:query'], query);
      assert.strictEqual(stored['graphiql:variables'], variables);
    });
  });

  it('keeps the inserted values free of "<"', () => {
    const html = injectIntoTemplate(template, '</script>', '<!--');
    const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1] ?? '';
    assert.ok(!script.includes('</script'));
    assert.ok(!script.includes('<!--'));
  });
});
