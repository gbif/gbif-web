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
import { urlPath } from '@/helpers/urlPath';
import { isActiveTerm } from './activeTerm';
import { sanitizeUpstreamError } from './upstreamError';
import { NotFoundError } from '@/helpers/GraphQL404Error';
import { VALID_GBIF_ROLES, VOLUNTEER_ROLES } from './validGbifRoles';

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

// One shape for all volunteer lists (ambassadors, mentors, trainers, translators, reviewers).
export function reduceVolunteer(person) {
  return {
    ...pick(person, ['firstName', 'surname', 'email', 'orcidId', 'institutionName', 'countryCode', 'languages']),
    badges: person.badges?.map((c) => pick(c, ['title', 'year'])),
  };
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
      'languages',
      'dataExpertise',
      'thematicExpertise',
    ]),
    badges: person.badges?.map((c) => pick(c, ['title', 'year'])),
    roles: (person.roles ?? [])
      .filter((r) => VALID_GBIF_ROLES.has(r.role))
      .map((r) => ({ role: r.role, term: pickTerm(r.term) })),
    participants: (person.participants ?? []).map((p) => pick(p, ['participantId'])),
  };
}

// Volunteers are published under privacy policy 2.8: name, email, ORCID, affiliation, languages, country
// and the recognitions they received. Phone, address, job title, picture and non-volunteer roles stay private.
export function reduceVolunteerContact(person) {
  const contact = reduceDirectoryContact(person);
  return {
    ...pick(contact, [
      'id',
      'firstName',
      'surname',
      'orcidId',
      'institutionName',
      'email',
      'countryCode',
      'languages',
      'dataExpertise',
      'thematicExpertise',
      'badges',
    ]),
    roles: contact.roles.filter((r) => VOLUNTEER_ROLES.includes(r.role) && isActiveTerm(r.term)),
    participants: [],
    restricted: true,
  };
}

class DirectoryPersonAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.apiv1;
    this.config = config;
  }

  // Directory errors must not reveal the private upstream (url, status or response body) to clients.
  async get(path, params, init) {
    try {
      return await super.get(path, params, init);
    } catch (err) {
      throw sanitizeUpstreamError(err);
    }
  }

  willSendRequest(path, request) {
    const header = createSignedGetHeader(path, this.config, { asApp: true });
    Object.keys(header).forEach((x) => {
      request.headers[x] = header[x];
    });
    request.headers['User-Agent'] = this.context.userAgent;
    if (this.context.referer) request.headers['referer'] = this.context.referer;
    if (this.context.clientPriority) request.headers['x-client-priority'] = this.context.clientPriority;
    if (this.context.siteUrl) request.headers['x-gbif-site-url'] = this.context.siteUrl;
    if (this.context.requestId) request.headers['x-request-id'] = this.context.requestId;
    if (this.context.clientIp) request.headers['x-client-ip'] = this.context.clientIp;
    request.agent = getDefaultAgent(this.baseURL, path);
  }

  async searchPeopleByRole({ query }) {
    const response = await this.get('/directory/person_role', stringify(query, { indices: false }));
    // Sanitize the data before returning it, this data is from an authorized endpoint.
    response.results = response.results.map(reducePersonRole);
    return response;
  }

  async getPersonByKey(key) {
    assertValidPersonKey(key);
    return this.get(urlPath`/directory/person/${key}`);
  }

  async getVolunteerByKey({ key }) {
    return reduceVolunteer(await this.getPersonByKey(key));
  }

  async getAwardWinnerByKey({ key }) {
    return reduceAwardWinner(await this.getPersonByKey(key));
  }

  async getDirectoryContactByKey({ key, restricted = false }) {
    const person = await this.getPersonByKey(key);
    return restricted ? reduceVolunteerContact(person) : reduceDirectoryContact(person);
  }

  async getProfilePicture({ key, query }) {
    // no valid key, no image (same as when the upstream has none)
    if (!isValidIntegerKey(key)) return null;
    try {
      const image = await this.get(
        urlPath`/directory/person/${key}/profilePicture`,
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
