import { RESTDataSource } from 'apollo-datasource-rest';
import { getDefaultAgent } from '#/requestAgents';

/**
 * Validates a string against a specific UUID format regex.
 * @param {string} uuid The string to validate.
 * @returns {boolean} True if the string is a valid UUID, false otherwise.
 */
const isValidUUID = (uuid) => {
  // Ensure the input is a string before testing
  if (typeof uuid !== 'string') {
    return false;
  }

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return uuidRegex.test(uuid);
};

class LocalContextAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = '';
    this.config = config;
  }

  willSendRequest(request) {
    // now that we make a public version, we might as well just make it open since the key is shared with everyone
    request.headers.set('X-Api-Key', this.config.localContextApiKey);
    request.headers.set('User-Agent', this.context.userAgent);
    request.headers.set('referer', this.context.referer);
    request.agent = getDefaultAgent(this.baseURL, request.path);
  }

  async getLocalContext(endpoint) {
    return this.get(getLocalContextAPIEndpoint(endpoint)).catch((err) => {
      // silently ignore errors for individual tags
      if (this.config.debug) {
        console.error(`Error fetching local context for ${endpoint}:`, err);
      }
      return null;
    });
  }

  async getLocalContextFromOccurrence({ dynamicProperties }) {
    if (!dynamicProperties) return null;
    try {
      const parsedProperties = JSON.parse(dynamicProperties);
      const projectId =
        parsedProperties?.local_contexts_project_id ??
        parsedProperties?.local_context_project_uri;
      if (projectId) {
        return this.getLocalContext(projectId);
      }
    } catch {
      // ignore JSON parse errors
    }
    return null;
  }

  async getDatasetLocalContext({ machineTags }) {
    if (!machineTags || !Array.isArray(machineTags)) return null;

    const filteredTags = machineTags.filter(
      (tag) =>
        tag?.namespace === 'localcontexts' &&
        tag?.name === 'local_contexts_project_id' &&
        !!tag?.value,
    );
    if (filteredTags.length === 0) return [];
    // only use the first project id if multiple are present
    const projectUrl = filteredTags[0].value;
    return this.getLocalContext(projectUrl);
  }
}

function getLocalContextAPIEndpoint(value) {
  if (!value) throw new Error('LocalContextAPI endpoint is not defined');

  if (isValidUUID(value)) {
    // looks like a valid uuid, construct the api url
    return `https://localcontextshub.org/api/v2/projects/${value}`;
  }

  // parse value as url. If it isn't a valid url should throw an error
  const url = new URL(value);
  // check that it is in fact a localcontextshub url, else do not call it with credentials
  const { host } = url;
  if (
    host !== 'localcontextshub.org' &&
    host !== 'sandbox.localcontextshub.org'
  ) {
    throw new Error(
      `LocalContextAPI endpoint is not a valid localcontextshub.org url: ${value}`,
    );
  }

  if (url.pathname.startsWith('/api/v2/projects')) {
    // looks like a valid api endpoint already
    return url.href;
  }

  const marker = '/projects/';
  const projectStringId = value.indexOf(marker);
  if (projectStringId > -1) {
    const id = value
      .substring(projectStringId + marker.length)
      .split(/[/?#]/)[0];
    if (id && id.length === 36) {
      const isSandbox = value.includes('sandbox');
      return `https://${
        isSandbox ? 'sandbox.' : ''
      }localcontextshub.org/api/v2/projects/${id}`;
    }
  }
  throw new Error(
    `Unable to parse LocalContextAPI endpoint from value: ${value}`,
  );
}

export default LocalContextAPI;
