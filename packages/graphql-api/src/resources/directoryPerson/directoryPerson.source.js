/**
 * This resource is from the directory API, which is not a public API.
 * Much of the data can be public though, but be cautious when adding new fields.
 */

import { RESTDataSource } from '@/RESTDataSource';
import pick from 'lodash/pick';
import { stringify } from 'qs';
import { getDefaultAgent } from '@/requestAgents';
import { createSignedGetHeader } from '@/helpers/auth/authenticatedGet';
import { isValidIntegerKey } from '@/helpers/utils';
import { NotFoundError } from '@/helpers/GraphQL404Error';
import { VALID_GBIF_ROLES } from './validGbifRoles';

// The directory person id is always an integer. Reject anything else so it can
// never be used to shape the signed upstream path.
function assertValidPersonKey(key) {
  if (!isValidIntegerKey(key)) {
    throw new NotFoundError();
  }
}

/*
 * The schema already limits what is public, but to make it more difficult to
 * expose something by accident, each list only keeps the fields the website shows.
 */
const pickTerm = (term) => term && pick(term, ['start', 'end']);

export function reducePersonRole(personRole) {
  return {
    ...pick(personRole, ['personId', 'award']),
    term: pickTerm(personRole.term),
  };
}

export function reduceTranslator(person) {
  return {
    ...pick(person, ['firstName', 'surname', 'countryCode', 'orcidId', 'languages']),
    certifications: person.certifications?.map((c) => pick(c, ['year'])),
  };
}

export function reduceAmbassador(person) {
  return pick(person, ['firstName', 'surname', 'email', 'orcidId', 'institutionName', 'countryCode', 'areasExpertise']);
}

export function reduceMentor(person) {
  return pick(person, ['firstName', 'surname', 'email', 'countryCode', 'areasExpertise']);
}

export function reduceAwardWinner(person) {
  return {
    ...pick(person, ['firstName', 'surname', 'countryCode', 'orcidId']),
    roles: (person.roles ?? [])
      .filter((r) => r.role === 'AWARD_WINNER')
      .map((r) => ({ award: r.award, term: pickTerm(r.term) })),
  };
}

// for the contact dialog of people listed in the directory
export function reduceDirectoryContact(person) {
  return {
    ...pick(person, [
      'id',
      'firstName',
      'surname',
      'orcidId',
      'jobTitle',
      'institutionName',
      'email',
      'phone',
      'address',
      'countryCode',
    ]),
    roles: (person.roles ?? [])
      .filter((r) => VALID_GBIF_ROLES.has(r.role))
      .map((r) => ({ role: r.role, term: pickTerm(r.term) })),
    participants: (person.participants ?? []).map((p) => pick(p, ['participantId'])),
  };
}

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
    if (this.context.referer) request.headers['referer'] = this.context.referer;
    if (this.context.clientPriority) request.headers['x-client-priority'] = this.context.clientPriority;
    if (this.context.siteUrl) request.headers['x-gbif-site-url'] = this.context.siteUrl;
    if (this.context.requestId) request.headers['x-request-id'] = this.context.requestId;
    if (this.context.clientIp) request.headers['x-client-ip'] = this.context.clientIp;
    request.agent = getDefaultAgent(this.baseURL, path);
  }

  async searchPeopleByRole({ query }) {
    const response = await this.get(
      '/directory/person_role',
      stringify(query, { indices: false }),
    );
    // Sanitize the data before returning it, this data is from an authorized endpoint.
    response.results = response.results.map(reducePersonRole);
    return response;
  }

  async getPersonByKey(key) {
    assertValidPersonKey(key);
    return this.get(`/directory/person/${key}`);
  }

  async getTranslatorByKey({ key }) {
    return reduceTranslator(await this.getPersonByKey(key));
  }

  async getAmbassadorByKey({ key }) {
    return reduceAmbassador(await this.getPersonByKey(key));
  }

  async getMentorByKey({ key }) {
    return reduceMentor(await this.getPersonByKey(key));
  }

  async getAwardWinnerByKey({ key }) {
    return reduceAwardWinner(await this.getPersonByKey(key));
  }

  async getDirectoryContactByKey({ key }) {
    return reduceDirectoryContact(await this.getPersonByKey(key));
  }

  async getProfilePicture({ key, query }) {
    // no valid key, no image (same as when the upstream has none)
    if (!isValidIntegerKey(key)) return null;
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
}

export default DirectoryPersonAPI;
