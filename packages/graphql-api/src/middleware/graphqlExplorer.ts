import path from 'node:path';
import fs from 'node:fs/promises';
import { NextFunction, Request, Response } from 'express';

export default async function graphqlExplorer(req: Request, res: Response, next: NextFunction) {
  // Skip if the request is not accepting html
  if (!req.headers.accept?.includes('text/html')) return next();

  // Load the html file that contains the graphql explorer
  const filePath = path.join(__dirname, '../../public/graphql-sandbox.html');
  const file = await fs.readFile(filePath, 'utf8');

  // Extract the variables from the query string
  let { variables } = req.query || {};
  if (variables && typeof variables === 'string') {
    try {
      variables = JSON.parse(variables);
    } catch (err) {
      // ignore
    }
  }
  if (variables && typeof variables === 'object') {
    variables = JSON.stringify(variables, null, 2);
  }

  // Extract the query from the query (this may have been prosseced by the hash middleware)
  const query = typeof req.query.query === 'string' ? req.query.query : '';
  const variablesString = typeof variables === 'string' ? variables : '';

  // Inject the values as JSON encoded string literals so query string content cannot break out
  // of the script. A function replacer is used so $-sequences in the value are not expanded.
  const processedFile = file
    .replace('INJECTED_QUERY', () => toJsStringLiteral(query))
    .replace('INJECTED_VARIABLES', () => toJsStringLiteral(variablesString));

  res.send(processedFile);
}

// Turn an arbitrary string into a safe JavaScript string literal, including the surrounding quotes.
// JSON.stringify escapes quotes and backslashes; we additionally escape "<" (so the value cannot
// close the script tag) and the line/paragraph separators U+2028 and U+2029 (valid JS line
// terminators that would otherwise break the parse). The separators are matched via their code
// points so this source file stays plain ASCII.
const UNSAFE_SCRIPT_CHARS = new RegExp('[<' + String.fromCharCode(0x2028) + String.fromCharCode(0x2029) + ']', 'g');

function toJsStringLiteral(value: string): string {
  return JSON.stringify(value).replace(
    UNSAFE_SCRIPT_CHARS,
    (char) => '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0'),
  );
}
