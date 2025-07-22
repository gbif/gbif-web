import { createSignedGetHeader } from '#/helpers/auth/authenticatedGet';
import { renameProperty } from '#/helpers/utils';
import { getDefaultAgent } from '#/requestAgents';
import { ResourceSearchAPI } from '#/resources/gbif/resource/resource.source';
import { RESTDataSource } from 'apollo-datasource-rest';
import pick from 'lodash/pick';
import { stringify } from 'qs';

function mergeParticipantData(directoryParticipant, resourceParticipant) {
  return {
    ...resourceParticipant,
    ...directoryParticipant,
  };
}

/**
 * This resource is from the directory API, which is not a public API.
 * Much of the data can be public though, but be cautious when adding new fields.
 */
class ParticipantDirectoryAPI extends RESTDataSource {
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
  reduceParticipant(participant) {
    const result = pick(participant, [
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
      'nodes',
    ]);

    result.people = participant.people?.map((p) => {
      return { person: pick(p.person, ['id', 'title', 'surname']) };
    });

    return result;
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

  async getNsgReport() {
    const list = await this.get(`/directory/report/5?format=json`);
    const reducedlist = list.map((p) => {
      return pick(p, [
        'id',
        'name',
        'title',
        'institutionName',
        'address',
        'addressCountry',
        'email',
        'role',
      ]);
    });
    return reducedlist;
  }
}

class ParticipantAPI {
  constructor(config) {
    this.directoryAPI = new ParticipantDirectoryAPI(config);
    this.resourceSearchAPI = new ResourceSearchAPI(config);
  }

  initialize(config) {
    this.context = config.context;
    this.directoryAPI.initialize(config);
    this.resourceSearchAPI.initialize(config);
  }

  async searchParticipants({ query }, locale) {
    // Rename the property to match the directory API
    renameProperty(query, 'participationStatus', 'participation_status');

    const response = await this.directoryAPI.searchParticipants({ query });
    if (!response) return;

    const resourceParticipants = await Promise.allSettled(
      response.results.map((p) =>
        this.resourceSearchAPI.getFirstEntryByQuery(
          { directoryId: p.id },
          locale,
        ),
      ),
    );

    response.results = response.results.map((directoryParticipant, i) => {
      if (resourceParticipants[i].status === 'fulfilled') {
        return mergeParticipantData(
          directoryParticipant,
          resourceParticipants[i].value,
        );
      }
      return directoryParticipant;
    });

    return response;
  }

  async getParticipantByDirectoryId({ id, locale }) {
    const directoryParticipant = await this.directoryAPI.getParticipantByKey({
      key: id,
    });
    if (!directoryParticipant) return;

    const resourceParticipant =
      await this.resourceSearchAPI.getFirstEntryByQuery(
        { directoryId: id },
        locale,
      );
    if (resourceParticipant) {
      return mergeParticipantData(directoryParticipant, resourceParticipant);
    }

    return directoryParticipant;
  }

  async mergeParticipantDirectoryData(resourceParticipant) {
    // If the resource does not have a directoryId, we return the resource as is.
    if (!resourceParticipant.directoryId) return resourceParticipant;

    const directoryParticipant = await this.directoryAPI.getParticipantByKey({
      key: resourceParticipant.directoryId,
    });
    if (directoryParticipant) {
      return mergeParticipantData(directoryParticipant, resourceParticipant);
    }

    return resourceParticipant;
  }

  async getNsgReport() {
    return this.directoryAPI.getNsgReport();
  }
}

export default ParticipantAPI;
