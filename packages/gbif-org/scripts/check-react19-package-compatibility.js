import fs from 'fs/promises';
import path from 'path';
import semver from 'semver';

// --- Configuration ---

/**
 * The analysis strategy to use for resolving version ranges from your package.json.
 *
 * 'lowest':  Checks the minimum version that satisfies the range (e.g., for "^1.0.4", it checks 1.0.4).
 *            This is a cautious approach, assuming packages may not follow semver perfectly.
 *            This is the setting you requested.
 *
 * 'highest': (Default NPM behavior) Checks the maximum version that satisfies the range.
 *            This reflects what a fresh `npm install` would likely give you.
 */
const CHECK_STRATEGY = 'lowest';

// The React 19 versions you are targeting for the upgrade.
const TARGET_VERSIONS = {
  react: '19.1.1',
  'react-dom': '19.1.1',
  '@types/react': '19.1.12',
  '@types/react-dom': '19.1.9',
};

// --- ANSI Colors for Console Output ---
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

const log = (color, message) => console.log(`${color}%s${colors.reset}`, message);

// --- Main Logic ---

async function getPackageInfo(packageName) {
  try {
    const response = await fetch(`https://registry.npmjs.org/${packageName}`);
    if (response.status === 404) {
      log(colors.yellow, `[WARN] Package not found on npm registry: ${packageName}`);
      return null;
    }
    if (!response.ok) throw new Error(`Failed to fetch ${packageName}: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    log(colors.red, `[ERROR] Could not fetch data for ${packageName}: ${error.message}`);
    return null;
  }
}

async function checkPackageCompatibility(packageName, versionRange) {
  const info = await getPackageInfo(packageName);
  if (!info) {
    return { name: packageName, status: 'error', reason: 'Package not found or fetch failed.' };
  }

  const availableVersions = Object.keys(info.versions || {});

  // Choose the version resolution strategy based on the configuration.
  let specificVersion;
  if (CHECK_STRATEGY === 'lowest') {
    specificVersion = semver.minSatisfying(availableVersions, versionRange);
  } else {
    specificVersion = semver.maxSatisfying(availableVersions, versionRange);
  }

  if (!specificVersion) {
    return {
      name: packageName,
      status: 'unresolved',
      reason: `Could not resolve a version for range "${versionRange}".`,
    };
  }

  const versionInfo = info.versions[specificVersion];
  const peerDependencies = versionInfo?.peerDependencies;

  if (!peerDependencies) {
    return { name: packageName, version: specificVersion, status: 'no_relevant_peer_dep' };
  }

  const incompatibilities = [];
  let hasRelevantPeerDep = false;

  for (const [peerDepName, targetVersion] of Object.entries(TARGET_VERSIONS)) {
    const requiredRange = peerDependencies[peerDepName];
    if (requiredRange) {
      hasRelevantPeerDep = true;
      if (!semver.satisfies(targetVersion, requiredRange)) {
        incompatibilities.push(
          `Requires ${peerDepName}: "${requiredRange}", which is not met by ${targetVersion}.`
        );
      }
    }
  }

  if (incompatibilities.length > 0) {
    return {
      name: packageName,
      version: specificVersion,
      status: 'incompatible',
      reasons: incompatibilities,
    };
  }

  if (hasRelevantPeerDep) {
    return { name: packageName, version: specificVersion, status: 'compatible' };
  }

  return { name: packageName, version: specificVersion, status: 'no_relevant_peer_dep' };
}

async function analyzeDependencies() {
  log(colors.cyan, '--- React 19 Compatibility Checker ---');
  log(colors.reset, `Analyzing dependencies using the "${CHECK_STRATEGY}" version strategy...\n`);

  let pkgJson;
  try {
    const pkgJsonPath = path.resolve(process.cwd(), 'package.json');
    const fileContent = await fs.readFile(pkgJsonPath, 'utf-8');
    pkgJson = JSON.parse(fileContent);
  } catch (error) {
    log(colors.red, `[ERROR] Could not read or parse package.json: ${error.message}`);
    process.exit(1);
  }

  const dependencies = { ...pkgJson.dependencies, ...pkgJson.devDependencies };
  Object.keys(TARGET_VERSIONS).forEach((key) => delete dependencies[key]);

  const packagesToCheck = Object.entries(dependencies);
  if (packagesToCheck.length === 0) {
    log(colors.green, 'No third-party dependencies to check.');
    return;
  }

  log(colors.reset, `Found ${packagesToCheck.length} dependencies to analyze.`);

  const promises = packagesToCheck.map(([name, version]) =>
    checkPackageCompatibility(name, version)
  );
  const results = await Promise.allSettled(promises);

  const reports = {
    incompatible: [],
    compatible: [],
    no_relevant_peer_dep: [],
    unresolved: [],
    error: [],
  };

  results.forEach((result) => {
    if (result.status === 'fulfilled' && result.value) {
      reports[result.value.status].push(result.value);
    } else {
      reports.error.push({
        status: 'error',
        reason: result.reason?.message || 'Unknown analysis error',
      });
    }
  });

  console.log('\n--- Analysis Complete ---');

  if (reports.incompatible.length > 0) {
    log(
      colors.red,
      `\n[!!] Found ${reports.incompatible.length} POTENTIALLY INCOMPATIBLE packages:`
    );
    reports.incompatible.forEach((pkg) => {
      console.log(`  - ${colors.yellow}${pkg.name}@${pkg.version}:${colors.reset}`);
      pkg.reasons.forEach((reason) => console.log(`    - ${reason}`));
    });
    log(
      colors.yellow,
      '\nNote: These packages explicitly list peer dependencies that are not satisfied by React 19. They are the highest priority to check for updates.'
    );
  }

  if (reports.compatible.length > 0) {
    log(colors.green, `\n[OK] Found ${reports.compatible.length} packages that appear compatible:`);
    const packageList = reports.compatible.map((p) => `${p.name}@${p.version}`).join(', ');
    console.log(`  (Checked versions: ${packageList})`);
  }

  if (reports.no_relevant_peer_dep.length > 0) {
    log(
      colors.gray,
      `\n[INFO] Found ${reports.no_relevant_peer_dep.length} packages with no direct peer dependency on React (usually safe):`
    );
    const packageList = reports.no_relevant_peer_dep.map((p) => p.name).join(', ');
    console.log(`  ${packageList}`);
  }

  if (reports.unresolved.length > 0 || reports.error.length > 0) {
    log(colors.yellow, `\n[WARN] Could not fully analyze some packages:`);
    reports.unresolved.forEach((pkg) => {
      console.log(
        `  - ${pkg.name}: ${pkg.reason} (Is it a private package, git URL, or local path?)`
      );
    });
    reports.error.forEach((pkg) => {
      console.log(`  - ${pkg.name || 'Unknown'}: ${pkg.reason}`);
    });
  }

  log(colors.cyan, '\n--- End of Report ---');
}

await analyzeDependencies();
