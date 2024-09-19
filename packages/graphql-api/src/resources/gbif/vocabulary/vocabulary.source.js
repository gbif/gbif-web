import { getDefaultAgent } from '#/requestAgents';
import { RESTDataSource } from 'apollo-datasource-rest';
import { stringify } from 'qs';

class VocabularyAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.apiv1;
  }

  willSendRequest(request) {
    request.headers.set('User-Agent', this.context.userAgent);
    request.headers.set('referer', this.context.referer);
    request.agent = getDefaultAgent(this.baseURL);
  }

  // since vocabulary search expose non releasd vocabularies, we will remove this option for now
  // async searchVocabularies({ query }) {
  //   return this.get('/vocabularies', stringify(query, { indices: false }));
  // }

  async getVocabulary({ key }) {
    return this.get(`/vocabularies/${key}`);
  }

  async searchConcepts({ vocabulary, query }) {
    return this.get(
      `/vocabularies/${vocabulary}/concepts/latestRelease?includeParents=true`,
      stringify(query, { indices: false }),
    ).then(response => {
      response.results.forEach(concept => {
        concept.vocabularyName = vocabulary;
      });
      return response;
    });
  }

  async getConcept({ vocabulary, concept, query }) {
    return this.get(
      `/vocabularies/${vocabulary}/concepts/latestRelease/${concept}?includeParents=true`,
      stringify(query, { indices: false }),
    ).then(response => {
      response.vocabularyName = vocabulary;
      return response;
    });
  }
}

export default VocabularyAPI;
