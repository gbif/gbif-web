import { get } from 'lodash';
import { RESTDataSource } from 'apollo-datasource-rest';
import { Parser } from 'xml2js';
import { stringify } from 'qs';
import { getDefaultAgent } from '@/requestAgents';

const urlSizeLimit = 2000; // use GET for requests that serialized is less than N characters

class EventAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.config = config;
    this.baseURL = config.apiv1;
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

  /* 
  searchEvents = async ({ query }) => {
    const body = { ...query, includeMeta: true };
    console.log(JSON.stringify(body));
    let response;
    if (JSON.stringify(body).length < urlSizeLimit) {
      response = await this.get(
        '/event',
        { body: JSON.stringify(body) },
        { signal: this.context.abortController.signal },
      );
    } else {
      response = await this.post('/event', body, {
        signal: this.context.abortController.signal,
      });
    }
    // map to support APIv1 naming
    response.documents.count = response.documents.total;
    response.documents.limit = response.documents.size;
    response.documents.offset = response.documents.from;
    response._predicate = body.predicate;
    response._q = query.q;
    return response;
  }; */

  searchEvents = async ({ query, limit, offset }) => {
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
