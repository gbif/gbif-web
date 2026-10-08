// Writes the schema the repo's typeDefs define, as SDL, to the given file. Used by gbif-org's
// e2e/live/schema-drift.mjs. Run from packages/graphql-api: npx tsx tools/printSchema.ts <out>
// A file, not stdout: the logger writes to stdout on import.
import { makeExecutableSchema } from '@graphql-tools/schema';
import { writeFileSync } from 'fs';
import { printSchema } from 'graphql';
import getSchema from '../src/typeDefs';

const out = process.argv[2];
if (!out) throw new Error('Usage: tsx tools/printSchema.ts <out.graphql>');

getSchema().then((typeDefs) => {
  // Apollo merges repeated type definitions the same way.
  writeFileSync(out, printSchema(makeExecutableSchema({ typeDefs })));
});
