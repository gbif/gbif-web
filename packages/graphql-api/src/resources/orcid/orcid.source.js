import { getDefaultAgent } from '@/requestAgents';
import { RESTDataSource } from '@/RESTDataSource';
import { NotFoundError } from '@/helpers/GraphQL404Error';

// e.g. 0000-0002-1825-0097. The last character is a checksum and can be X.
const ORCID_REGEX = /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/;

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
    if (!ORCID_REGEX.test(`${key}`)) throw new NotFoundError();
    return this.get(`/${key}/record`).then(reduce);
  }
}

export default OrcidAPI;
