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
  visit,
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
function documents() {
  /** @type {Array<{ file: string, document: import('graphql').DocumentNode }>} */
  const parsed = [];
  // Interpolated documents are only complete at runtime; their fragments are unknown here.
  let skipped = 0;
  const skippedFragments = new Set();
  for (const entry of readdirSync('src', { recursive: true, encoding: 'utf8' })) {
    const file = join('src', entry);
    if (!/\.(ts|tsx|mjs)$/.test(file) || file.startsWith(join('src', 'gql'))) continue;
    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(/\/\*\s*GraphQL\s*\*\/\s*`([^`]*)`/g)) {
      const line = source.slice(source.lastIndexOf('\n', match.index) + 1, match.index);
      if (line.trimStart().startsWith('//')) continue;
      if (match[1].includes('${')) {
        skipped++;
        for (const m of match[1].matchAll(/\bfragment\s+(\w+)\s+on\b/g)) skippedFragments.add(m[1]);
      } else {
        parsed.push({ file, document: parse(match[1]) });
      }
    }
  }
  return { parsed, skipped, skippedFragments };
}

/**
 * The fragments a definition spreads, transitively.
 * @param {import('graphql').ASTNode} node
 * @param {Map<string, { def: import('graphql').FragmentDefinitionNode }>} fragments
 * @param {Set<string>} [seen]
 */
function spreads(node, fragments, seen = new Set()) {
  visit(node, {
    FragmentSpread(spread) {
      const name = spread.name.value;
      if (seen.has(name)) return;
      seen.add(name);
      const fragment = fragments.get(name);
      if (fragment) spreads(fragment.def, fragments, seen);
    },
  });
  return seen;
}

/**
 * @param {import('graphql').GraphQLError} error
 * @param {import('graphql').DefinitionNode} def
 */
function inside(error, def) {
  return (error.nodes ?? []).some(
    (n) =>
      n.loc?.source === def.loc?.source &&
      (n.loc?.start ?? -1) >= (def.loc?.start ?? 0) &&
      (n.loc?.end ?? Infinity) <= (def.loc?.end ?? 0)
  );
}

/** @param {import('graphql').GraphQLSchema} schema */
function validateOperations(schema) {
  const { parsed, skipped, skippedFragments } = documents();
  // Fragments live in other files and are joined in at runtime by fragmentManager.
  /** @type {Map<string, { def: import('graphql').FragmentDefinitionNode, file: string }>} */
  const fragments = new Map();
  for (const { file, document } of parsed) {
    for (const def of document.definitions) {
      if (def.kind === Kind.FRAGMENT_DEFINITION) fragments.set(def.name.value, { def, file });
    }
  }
  const rules = specifiedRules.filter((rule) => rule !== NoUnusedFragmentsRule);
  /**
   * Validates one definition with the fragments it spreads, keeping only errors located in it, so a
   * broken fragment is reported once, under its own file.
   * @param {import('graphql').DefinitionNode} def
   */
  const check = (def) => {
    const used = [...spreads(def, fragments)];
    const unknown = used.filter((name) => skippedFragments.has(name) && !fragments.has(name));
    if (unknown.length) return { unknown, errors: [] };
    /** @type {import('graphql').DocumentNode} */
    const doc = {
      kind: Kind.DOCUMENT,
      definitions: [def, ...used.flatMap((name) => fragments.get(name)?.def ?? [])],
    };
    const errors = validate(schema, doc, rules).filter((e) => !e.nodes || inside(e, def));
    return { unknown, errors };
  };

  const failures = [];
  /** @type {string[]} */
  const notChecked = [];
  let checked = 0;
  for (const { file, document } of parsed) {
    for (const def of document.definitions) {
      if (def.kind !== Kind.OPERATION_DEFINITION && def.kind !== Kind.FRAGMENT_DEFINITION) continue;
      const name = def.name?.value ?? '(anonymous)';
      const { unknown, errors } = check(def);
      if (unknown.length) {
        notChecked.push(`${file} ${name} (spreads ${unknown.join(', ')})`);
        continue;
      }
      if (def.kind === Kind.OPERATION_DEFINITION) checked++;
      for (const error of errors) failures.push(`${file} ${name}: ${error.message}`);
    }
  }
  return { checked, skipped, skippedFragments: [...skippedFragments], notChecked, failures };
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
    `${ops.skipped} interpolated document(s) skipped` +
    (ops.skippedFragments.length ? ` (fragments ${ops.skippedFragments.join(', ')}).` : '.')
);
for (const failure of ops.failures) console.log(`  ${failure}`);
if (ops.notChecked.length) {
  console.log(`Not checked, they spread fragments from skipped documents:`);
  for (const item of ops.notChecked) console.log(`  ${item}`);
}

process.exitCode = ops.failures.length || deployedOnly.length ? 1 : 0;
