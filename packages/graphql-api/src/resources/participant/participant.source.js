/**
 * This resource is from the directory API, which is not a public API.
 * Much of the data can be public though, but be cautious when adding new fields.
 */
// const { ApolloError } = require('apollo-server');
const { RESTDataSource } = require('apollo-datasource-rest');
const qs = require('qs');
const pick = require('lodash/pick');
const config = require('../../config');
const { createSignedGetHeader } = require('../../auth/authenticatedGet');
const API_V1 = config.apiv1;

class ParticipantAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = API_V1;
  }

  willSendRequest(request) {
    const header = createSignedGetHeader(request.path);
    Object.keys(header).forEach(x => request.headers.set(x, header[x]));
    request.headers.set('User-Agent', `GBIF GraphQL API`);
  }

  /*
   * The schemas already limits what is public, but to make it more difficult to 
   * add something, we also sanitize the data before returning it.
   */
  reduceParticipant(participant) {
    return pick(participant, [
      'id',
      'abbreviatedName',
      'name',
      'type',
      'participationStatus',
      'participantUrl',
      'membershipStart',
      'gbifRegion',
      'countryCode',
      'created',
      'modified',
    ]);
  }

  async searchParticipants({ query }) {
    const response = await this.get('/directory/participant', qs.stringify(query, { indices: false }));
    // Sanitize the data before returning it, this data is from an authorized endpoint.
    response.results = response.results.map(p => this.reduceParticipant(p));
    return response;
  }

  async getParticipantByKey({ key }) {
    const participant = await this.get(`/directory/participant/${key}`);
    // Sanitize the data before returning it, this data is from an authorized endpoint.
    return this.reduceParticipant(participant);
  }

  /*
  getParticipantsByKeys({ participantKeys }) {
    return Promise.all(
      participantKeys.map(key => this.getParticipantByKey({ key })),
    );
  }
  */
}

module.exports = ParticipantAPI;