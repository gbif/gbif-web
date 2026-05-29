/**
 * This resource is from the directory API, which is not a public API.
 * Much of the data can be public though, but be cautious when adding new fields.
 */

import { RESTDataSource } from '@/RESTDataSource';
import pick from 'lodash/pick';
import { stringify } from 'qs';
import { getDefaultAgent } from '@/requestAgents';
import { createSignedGetHeader } from '@/helpers/auth/authenticatedGet';
import { VALID_GBIF_ROLES } from './validGbifRoles';

class DirectoryPersonAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.apiv1;
    this.config = config;
  }

  willSendRequest(path, request) {
    const header = createSignedGetHeader(path, this.config);
    Object.keys(header).forEach((x) => { request.headers[x] = header[x]; });
    request.headers['User-Agent'] = this.context.userAgent;
    request.headers['referer'] = this.context.referer;
    request.agent = getDefaultAgent(this.baseURL, path);
  }

  /*
   * The schemas already limits what is public, but to make it more difficult to
   * add something, we also sanitize the data before returning it.
   */
  // eslint-disable-next-line class-methods-use-this
  reduceDirectoryPerson(directoryPerson) {
    const result = pick(directoryPerson, [
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
    if (result.roles) {
      result.roles = result.roles.filter((r) => VALID_GBIF_ROLES.has(r.role));
    }
    return result;
  }

  // for public contacts
  reduceDirectoryContact(directoryPerson) {
    const result = pick(directoryPerson, [
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
      'address',
    ]);
    if (result.roles) {
      result.roles = result.roles.filter((r) => VALID_GBIF_ROLES.has(r.role));
    }
    return result;
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
