/**
 * This resource is from the directory API, which is not a public API.
 * Much of the data can be public though, but be cautious when adding new fields.
 */

import { createSignedGetHeader } from '#/helpers/auth/authenticatedGet';
import { getDefaultAgent } from '#/requestAgents';
import { RESTDataSource } from 'apollo-datasource-rest';
import pick from 'lodash/pick';
import { stringify } from 'qs';

class DirectoryPersonAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.apiv1;
    this.config = config;
  }

  willSendRequest(request) {
    const header = createSignedGetHeader(request.path, this.config);
    Object.keys(header).forEach((x) => request.headers.set(x, header[x]));
    request.headers.set('User-Agent', this.context.userAgent);
    request.headers.set('referer', this.context.referer);
    request.agent = getDefaultAgent(this.baseURL, request.path);
  }

  /*
   * The schemas already limits what is public, but to make it more difficult to
   * add something, we also sanitize the data before returning it.
   */
  // eslint-disable-next-line class-methods-use-this
  reduceDirectoryPerson(directoryPerson) {
    return pick(directoryPerson, [
      'id',
      'firstName',
      'surname',
      'title',
      'orcidId',
      'roles',
      'countryCode',
      'certifications',
      'languages',
      'areasExpertise',
      'profileDescriptions',
      'created',
      'modified',
    ]);
  }

  // for public contacts
  reduceDirectoryContact(directoryPerson) {
    return pick(directoryPerson, [
      'id',
      'firstName',
      'surname',
      'title',
      'orcidId',
      'jobTitle',
      'institutionName',
      'roles',
      'countryCode',
      'phone',
      'email',
      'certifications',
      'languages',
      'areasExpertise',
      'profileDescriptions',
      'participants',
      'created',
      'modified',
    ]);
  }

  async searchPeopleByRole({ query }) {
    const response = await this.get(
      '/directory/person_role',
      stringify(query, { indices: false }),
    );
    // Sanitize the data before returning it, this data is from an authorized endpoint.
    // response.results = response.results.map((p) => this.reduceDirectoryPerson(p));
    return response;
  }

  async getDirectoryPersonByKey({ key }) {
    const directoryPerson = await this.get(`/directory/person/${key}`);
    // Sanitize the data before returning it, this data is from an authorized endpoint.
    return this.reduceDirectoryPerson(directoryPerson);
  }

  async getDirectoryContactByKey({ key }) {
    const directoryPerson = await this.get(`/directory/person/${key}`);
    // Sanitize the data before returning it, this data is from an authorized endpoint.
    return this.reduceDirectoryContact(directoryPerson);
  }

  async getProfilePicture({ key, query }) {
    try {
      const image = await this.get(
        `/directory/person/${key}/profilePicture`,
        stringify(query, { indices: false }),
      );
      return image;
    } catch (err) {
      // no image found
      return null;
    }
  }

  /*
  getDirectoryPersonsByKeys({ directoryPersonKeys }) {
    return Promise.all(
      directoryPersonKeys.map(key => this.getDirectoryPersonByKey({ key })),
    );
  }
  */
}

export default DirectoryPersonAPI;
