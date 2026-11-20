import { secretEnv } from '../envConfig.mjs';

// Settings of this gbif-web instance that admins can change live from Backstage, without a
// redeploy. Kept in memory: a restart goes back to the configured values, as with the GraphQL and
// es-api runtime settings. For switching something off during an incident, not for lasting config.
const settings = {
  // Errors from browsers (gbif/routes/clientErrors). CLIENT_ERROR_REPORTING=off starts with it off.
  clientErrorReporting: secretEnv.CLIENT_ERROR_REPORTING !== 'off',
};

export function getRuntimeSettings() {
  return { ...settings };
}

// Throws unless the patch only has known settings with the right type.
export function validateRuntimeSettings(patch) {
  if (!patch || typeof patch !== 'object' || Array.isArray(patch)) {
    throw new Error('Settings must be an object');
  }
  for (const [name, value] of Object.entries(patch)) {
    if (!Object.hasOwn(settings, name)) throw new Error(`Unknown setting: ${name}`);
    if (typeof value !== typeof settings[name]) throw new Error(`Invalid value for ${name}`);
  }
}

// Apply a partial update. A bad patch is refused as a whole, so it changes nothing.
export function setRuntimeSettings(patch) {
  validateRuntimeSettings(patch);
  Object.assign(settings, patch);
  return getRuntimeSettings();
}
