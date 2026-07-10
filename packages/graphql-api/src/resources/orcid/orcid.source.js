import { getDefaultAgent } from '@/requestAgents';
import { RESTDataSource } from '@/RESTDataSource';

function reduce(response) {
  const givenNames = response?.person?.name?.['given-names']?.value;
  const familyName = response?.person?.name?.['family-name']?.value;
  const name =
    givenNames || familyName
      ? `${givenNames || ''} ${familyName || ''}`.trim()
      : null;
  return {
    source: {
      type: 'ORCID',
    },
    key: response?.['orcid-identifier']?.path,
    name,
    raw: response,
  };
}

class OrcidAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.orcid.pubApi;
  }

  // eslint-disable-next-line class-methods-use-this
  willSendRequest(path, request) {
    request.headers['Accept'] = 'application/json';
    request.agent = getDefaultAgent(this.baseURL, path);
  }

  async getOrcidByKey({ key }) {
    return this.get(`/${key}/record`).then(reduce);
  }
}

export default OrcidAPI;
