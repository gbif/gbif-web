import path from 'node:path';
import fs from 'node:fs/promises';
import { NextFunction, Request, Response } from 'express';

export default async function graphqlExplorer(
  req: Request,
  res: Response,
  next: NextFunction,
) {
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

  // Replace the variables in the html file
  const processedFile = file
    .replace('INJECTED_QUERY', query)
    .replace('INJECTED_VARIABLES', variables as string);

  res.send(processedFile);
}
