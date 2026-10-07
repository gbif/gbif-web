// Live check, not part of `npm run e2e`: compares the deployed GraphQL schema with the repo's and
// validates every gbif-org operation against the deployed one. Recordings come from production, so
// drift there would otherwise replay silently.
//
//   npm run e2e:schema-drift
//
// Needs network access to graphql.gbif.org, `npm ci` in packages/graphql-api, and a
// packages/graphql-api/.env (copy .env.example; its config is read on import).
//
// Exit 1 when an operation fails validation, or when the repo lacks something deployed (deployed
// changes not in the repo). Repo changes not yet deployed are only reported.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import {
  buildClientSchema,
  buildSchema,
  findBreakingChanges,
  findDangerousChanges,
  getIntrospectionQuery,
  Kind,
  NoUnusedFragmentsRule,
  parse,
  specifiedRules,
  validate,
} from 'graphql';

const LIVE_ENDPOINT = process.env.SCHEMA_DRIFT_ENDPOINT ?? 'https://graphql.gbif.org/graphql';
const GRAPHQL_API = resolve('../graphql-api');

async function liveSchema() {
  // A plain POST: graphql-codegen's client gets a 403 from the proxy in front of the endpoint.
  const response = await fetch(LIVE_ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query: getIntrospectionQuery() }),
  });
  if (!response.ok) throw new Error(`Introspection failed: HTTP ${response.status}`);
  const { data, errors } = await response.json();
  if (errors) throw new Error(`Introspection failed: ${JSON.stringify(errors)}`);
  return buildClientSchema(data);
}

function repoSchema() {
  if (!existsSync(join(GRAPHQL_API, '.env'))) {
    throw new Error('packages/graphql-api/.env is missing: copy .env.example to .env');
  }
  const out = join(mkdtempSync(join(tmpdir(), 'schema-drift-')), 'repo.graphql');
  execFileSync('npx', ['tsx', 'tools/printSchema.ts', out], { cwd: GRAPHQL_API, stdio: 'ignore' });
  return buildSchema(readFileSync(out, 'utf8'));
}

// The same documents graphql-codegen reads: template literals marked /* GraphQL */.
function operations() {
  const documents = [];
  let skipped = 0;
  for (const entry of readdirSync('src', { recursive: true, encoding: 'utf8' })) {
    const file = join('src', entry);
    if (!/\.(ts|tsx|mjs)$/.test(file) || file.startsWith(join('src', 'gql'))) continue;
    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(/\/\*\s*GraphQL\s*\*\/\s*`([^`]*)`/g)) {
      const line = source.slice(source.lastIndexOf('\n', match.index) + 1, match.index);
      if (line.trimStart().startsWith('//')) continue;
      // Interpolated documents are only complete at runtime.
      if (match[1].includes('${')) skipped++;
      else documents.push({ file, document: parse(match[1]) });
    }
  }
  return { documents, skipped };
}

/** @param {import('graphql').GraphQLSchema} schema */
function validateOperations(schema) {
  const { documents, skipped } = operations();
  // Fragments live in other files and are joined in at runtime by fragmentManager.
  /** @type {Map<string, import('graphql').FragmentDefinitionNode>} */
  const fragments = new Map();
  for (const { document } of documents) {
    for (const def of document.definitions) {
      if (def.kind === Kind.FRAGMENT_DEFINITION) fragments.set(def.name.value, def);
    }
  }
  const rules = specifiedRules.filter((rule) => rule !== NoUnusedFragmentsRule);
  const failures = [];
  let checked = 0;
  for (const { file, document } of documents) {
    for (const def of document.definitions) {
      if (def.kind !== Kind.OPERATION_DEFINITION) continue;
      checked++;
      /** @type {import('graphql').DocumentNode} */
      const withFragments = { kind: Kind.DOCUMENT, definitions: [def, ...fragments.values()] };
      for (const error of validate(schema, withFragments, rules)) {
        failures.push(`${file} ${def.name?.value ?? '(anonymous)'}: ${error.message}`);
      }
    }
  }
  return { checked, skipped, failures };
}

/** @param {Array<{ type: string, description: string }>} changes */
const list = (changes) => changes.map((c) => `  ${c.type}: ${c.description}`).join('\n');

const live = await liveSchema();
const repo = repoSchema();

// old -> new: what deploying `new` over `old` would break. Live -> repo: deployed but missing from
// the repo. Repo -> live: in the repo but not deployed yet.
const deployedOnly = findBreakingChanges(live, repo);
const undeployed = [...findBreakingChanges(repo, live), ...findDangerousChanges(repo, live)];
const ops = validateOperations(live);

if (deployedOnly.length) {
  console.log(`Deployed but not in the repo (${deployedOnly.length}):\n${list(deployedOnly)}\n`);
}
if (undeployed.length) {
  console.log(
    `In the repo but not deployed, warning only (${undeployed.length}):\n${list(undeployed)}\n`
  );
}
console.log(
  `Operations: ${ops.checked} checked against ${LIVE_ENDPOINT}, ${ops.failures.length} invalid, ` +
    `${ops.skipped} skipped (interpolated).`
);
for (const failure of ops.failures) console.log(`  ${failure}`);

process.exitCode = ops.failures.length || deployedOnly.length ? 1 : 0;
