import { RESTDataSource } from 'apollo-datasource-rest';
import { stringify } from 'qs';
import { getDefaultAgent } from '@/requestAgents';

class EventAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.config = config;
    this.baseURL = `${config.apiv1}/experimental`;
  }

  willSendRequest(request) {
    // now that we make a public version, we might as well just make it open since the key is shared with everyone
    //    request.headers.set('Authorization', `ApiKey-v1 ${this.config.apiEsKey}`);
    request.agent = getDefaultAgent(this.baseURL, request.path);
  }

  async searchEventDocuments({ query }) {
    const response = await this.searchEvents({ query });
    return response.documents;
  }

  async searchOccurrenceDocuments({ query }) {
    const response = await this.searchOccurrences({ query });
    return response.documents;
  }

  async searchEventOccurrences({
    eventId,
    datasetKey,
    locationId,
    month,
    year,
    size,
    from,
  }) {
    const response = await this.eventOccurrences({
      eventId,
      datasetKey,
      locationId,
      month,
      year,
      size,
      from,
    });
    const results = response.documents.results.map((doc) => {
      return {
        key: doc.key,
        scientificName: doc.acceptedScientificName,
        kingdom: doc.kingdom,
        family: doc.family,
        individualCount: doc.individualCount,
        occurrenceStatus: doc.occurrenceStatus,
        basisOfRecord: doc.basisOfRecord,
      };
    });
    return {
      total: response.documents.total,
      size: response.documents.size,
      from: response.documents.from,
      results,
    };
  }

  async getArchive(datasetKey) {
    try {
      const response = await this.get(
        this.config.apiDownloads.replace('{datasetKey}', datasetKey),
        { signal: this.context.abortController.signal },
      );
      // map to support APIv1 naming
      return response;
    } catch (err) {
      return {
        url: null,
        fileSizeInMB: null,
        modified: null,
      };
    }
  }

  searchEvents = async ({ query, limit, offset }) => {
    console.log(query);
    const response = await this.get(
      '/event/search',
      stringify({ limit, offset, ...query }, { indices: false }),
    );
    response._query = query;
    return response;
  };

  async getEventByKey({ eventId, datasetKey }) {
    return this.get(`/event/${datasetKey}/${encodeURIComponent(eventId)}`);
  }
}

export default EventAPI;
