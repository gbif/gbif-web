import { getDefaultAgent } from '#/requestAgents';
import { RESTDataSource } from '@apollo/datasource-rest';

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
  constructor(context) {
    super(context);
    this.baseURL = context.config.orcid.pubApi;
  }

  // eslint-disable-next-line class-methods-use-this
  willSendRequest(_path, request) {
    request.headers['Accept'] = 'application/json';
    request.agent = getDefaultAgent(this.baseURL);
  }

  async getOrcidByKey({ key }) {
    return this.get(`/${key}/record`).then(reduce);
  }
}

export default OrcidAPI;
