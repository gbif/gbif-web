/* eslint-disable class-methods-use-this */

import { getDefaultAgent } from '#/requestAgents';
import { RESTDataSource } from 'apollo-datasource-rest';

function reduce(response) {
  if (!response?.viafID) return undefined;

  // it isn't clear to me how the viaf response is structured.
  // All fields can apparently be either an array or an object - that makes it akward to use
  // For now I'm just going to assume this will give me the name
  const mainHeadings = response?.mainHeadings;
  const data = mainHeadings.data[0] || mainHeadings.data;
  const name = data?.text;
  const birthDate = response?.birthDate;
  const deathDate = response?.deathDate;
  return {
    source: {
      type: 'VIAF',
    },
    key: response?.viafID,
    name,
    birthDate: birthDate !== '0' ? birthDate : null, // for some reason they return 0 for unknown
    deathDate: deathDate !== '0' ? deathDate : null, // for some reason they return 0 for unknown
    raw: response,
  };
}

class ViafAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.viaf.api;
  }

  willSendRequest(request) {
    request.headers.set('Accept', 'application/json');
    request.agent = getDefaultAgent(this.baseURL);
  }

  async getViafByKey({ key }) {
    const response = await this.get(`http://viaf.org/viaf/${key}`);
    if (response?.redirect?.directto) {
      return this.get(
        `http://viaf.org/viaf/${response?.redirect?.directto}`,
      ).then(reduce);
    }
    return reduce(response);
  }
}

export default ViafAPI;
