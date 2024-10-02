/* eslint-disable class-methods-use-this */

import { getDefaultAgent } from '#/requestAgents';
import { RESTDataSource } from '@apollo/datasource-rest';

function reduce(people) {
  try {
    const sources = people
      .filter((x) => x)
      .map((p) => {
        return Object.keys(p).reduce((map, field) => {
          if (field === 'source') return map;
          if (field === 'raw') return map;
          if (field === 'key') return map;
          if (p[field] === null || typeof p[field] === 'undefined') return map;

          // eslint-disable-next-line no-param-reassign
          map[field] = {
            value: p[field],
            source: p.source,
          };
          return map;
        }, {});
      });
    const merged = Object.assign({}, ...sources);
    return merged;
  } catch (err) {
    console.log(err);
    return null;
  }
}

class PersonAPI extends RESTDataSource {
  constructor(context) {
    super(context);
    this.baseURL = context.config.orcid.pubApi;
  }

  willSendRequest(_path, request) {
    request.headers['Accept'] = 'application/json';
    request.agent = getDefaultAgent(this.baseURL);
  }

  async getPersonByOrcid({ key, dataSources, expand }) {
    const [wiki, type] = await Promise.all([
      expand ? dataSources.wikidataAPI.getWikidataPersonByOrcid({ key }) : null,
      dataSources.orcidAPI.getOrcidByKey({ key }),
    ]);
    return reduce([wiki, type]);
  }

  async getPersonByViaf({ key, dataSources, expand }) {
    const [wiki, type] = await Promise.all([
      expand ? dataSources.wikidataAPI.getWikidataPersonByViaf({ key }) : null,
      dataSources.viafAPI.getViafByKey({ key }),
    ]);
    return reduce([type, wiki]); // prefer wiki over viaf as VIAF has a somewhat obscure response format
  }

  async getPersonByIpni({ key, dataSources }) {
    const [wiki] = await Promise.all([
      dataSources.wikidataAPI.getWikidataPersonByIpni({ key }),
    ]);
    return reduce([wiki]);
  }

  async getPersonByWikidata({ key, dataSources }) {
    const [wiki] = await Promise.all([
      dataSources.wikidataAPI.getPersonByKey({ key }),
    ]);
    return reduce([wiki]);
  }

  async getPersonByIdentifier({ type, value, dataSources, expand }) {
    const val = value.replace(/\/$/, '');
    const key = val.substr(val.lastIndexOf('/') + 1);

    // based on the identifiers
    if (type === 'ORCID')
      return this.getPersonByOrcid({ key, dataSources, expand });
    if (type === 'WIKIDATA')
      return this.getPersonByWikidata({ key, dataSources });
    if (type === 'OTHER' && val.includes('://viaf.org/viaf'))
      return this.getPersonByViaf({ key, dataSources, expand });
    if (
      type === 'OTHER' &&
      value.startsWith('https://www.ipni.org/ipni/idAuthorSearch.do?id=')
    ) {
      const ipni = value.substr(value.lastIndexOf('=') + 1);
      return this.getPersonByIpni({ key: ipni, dataSources });
    }

    return undefined;
  }
}

export default PersonAPI;
