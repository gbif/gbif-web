import { getDefaultAgent } from '#/requestAgents';
import { RESTDataSource } from 'apollo-datasource-rest';

class LocalContextAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = '';
    this.config = config;
  }

  willSendRequest(request) {
    console.log('LocalContextAPI willSendRequest');
    // now that we make a public version, we might as well just make it open since the key is shared with everyone
    request.headers.set('X-Api-Key', this.config.localContextApiKey);
    request.headers.set('User-Agent', this.context.userAgent);
    request.headers.set('referer', this.context.referer);
    request.agent = getDefaultAgent(this.baseURL, request.path);
  }

  async getLocalContext({ dynamicProperties }) {
    if (dynamicProperties) {
      try {
        const parsedProperties = JSON.parse(dynamicProperties);
        if (parsedProperties?.local_context_project_uri) {
          return this.get(parsedProperties.local_context_project_uri)
            .then((res) => {
              return res?.notice || null;
            })
            .catch((err) => {
              console.error('Error fetching local context:', err);
              return null;
            });
        }
        return null;
      } catch {
        // ignore JSON parse errors
        return null;
      }
    } else {
      return null;
    }
  }

  async getDatasetLocalContext({ machineTags }) {
    if (machineTags) {
      const filteredTags = machineTags.filter(
        (tag) =>
          tag?.namespace === 'localcontext' &&
          tag?.name === 'project_id' &&
          !!tag?.value,
      );
      if (filteredTags.length === 0) return [];
      return Promise.all(
        filteredTags.map((tag) =>
          this.get(tag.value).then((res) => {
            return res?.notice || null;
          }),
        ),
      ).then((results) => {
        return results.flat();
      });
    }
    return [];
  }
}

export default LocalContextAPI;
