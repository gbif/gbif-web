/**
 * This resource is from the directory API, which is not a public API.
 * Much of the data can be public though, but be cautious when adding new fields.
 */

import { RESTDataSource } from 'apollo-datasource-rest';
import { stringify } from 'qs';
import pick from 'lodash/pick';
import { createSignedGetHeader } from '#/helpers/auth/authenticatedGet';

class ParticipantAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.gbif.apiv1;
    this.config = config.gbif;
  }

  willSendRequest(request) {
    const header = createSignedGetHeader(request.path, this.config);
    Object.keys(header).forEach((x) => request.headers.set(x, header[x]));
  }

  /*
   * The schemas already limits what is public, but to make it more difficult to
   * add something, we also sanitize the data before returning it.
   */
  // eslint-disable-next-line class-methods-use-this
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
    const response = await this.get(
      '/directory/participant',
      stringify(query, { indices: false }),
    );
    // Sanitize the data before returning it, this data is from an authorized endpoint.
    response.results = response.results.map((p) => this.reduceParticipant(p));
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

export default ParticipantAPI;
