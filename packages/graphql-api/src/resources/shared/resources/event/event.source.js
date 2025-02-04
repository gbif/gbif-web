import { get } from 'lodash';
import { RESTDataSource } from 'apollo-datasource-rest';
import { Parser } from 'xml2js';
import { getDefaultAgent } from '#/requestAgents';

const urlSizeLimit = 2000; // use GET for requests that serialized is less than N characters

class EventAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.config = config;
    this.baseURL = config.apiEs;
  }

  willSendRequest(request) {
    // now that we make a public version, we might as well just make it open since the key is shared with everyone
    request.headers.set('Authorization', `ApiKey-v1 ${this.config.apiEsKey}`);
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
    eventID,
    datasetKey,
    locationID,
    month,
    year,
    size,
    from,
  }) {
    const response = await this.eventOccurrences({
      eventID,
      datasetKey,
      locationID,
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

  searchEvents = async ({ query }) => {
    const body = { ...query, includeMeta: true };
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
    return response;
  };

  eventOccurrences = async ({
    eventID,
    datasetKey,
    locationID,
    month,
    year,
    size,
    from,
  }) => {
    const params = {
      size,
      from,
      ...(eventID && { eventHierarchy: eventID }),
      ...(datasetKey && { datasetKey }),
      ...(locationID && { locationID }),
      ...(month && { month }),
      ...(year && { year }),
    };

    const response = await this.get('/event-occurrence', params, {
      signal: this.context.abortController.signal,
    });

    // map to support APIv1 naming
    response.documents.count = response.documents.total;
    response.documents.limit = response.documents.size;
    response.documents.offset = response.documents.from;
    return response;
  };

  searchOccurrences = async ({ query }) => {
    const body = { ...query, includeMeta: true };
    let response;
    if (JSON.stringify(body).length < urlSizeLimit) {
      response = await this.get(
        '/event-occurrence',
        { body: JSON.stringify(body) },
        { signal: this.context.abortController.signal },
      );
    } else {
      response = await this.post('/event-occurrence', body, {
        signal: this.context.abortController.signal,
      });
    }
    // map to support APIv1 naming
    response.documents.count = response.documents.total;
    response.documents.limit = response.documents.size;
    response.documents.offset = response.documents.from;
    response._predicate = body.predicate;
    return response;
  };

  async getEventByKey({ eventID, datasetKey }) {
    return this.get(`/event/key/${datasetKey}/${encodeURIComponent(eventID)}`);
  }

  async getDatasetEML({ datasetKey }) {
    const parser = new Parser();
    const url = this.config.datasetEml.replace('{datasetKey}', datasetKey);
    const xml = await this.get(url);
    const datasetJson = await parser.parseStringPromise(xml);
    const dataset = get(datasetJson, "['eml:eml'].dataset[0]");
    const additionalMetadata = get(
      datasetJson,
      "['eml:eml'].additionalMetadata[0]",
    );
    const datasetCurated = {
      key: datasetKey,
      title: get(dataset, 'title[0]._'),
      abstract: get(dataset, 'abstract[0].para[0]'),
      purpose: get(dataset, 'purpose[0].para[0]'),
      intellectualRights: get(dataset, 'intellectualRights[0].para[0]'),
      methods: get(dataset, 'methods'),
      contact: get(dataset, 'contact'),
      citation: get(additionalMetadata, 'metadata[0].gbif[0].citation'),
      rights: get(additionalMetadata, 'metadata[0].gbif[0].rights'),
    };

    // return datasetCurrated;
    return {
      value: datasetCurated,
      raw: datasetJson,
    };
  }

  async getLocation({ locationID }) {
    const query = JSON.stringify({ locationID });
    const response = await this.get(
      '/event',
      { body: query },
      { signal: this.context.abortController.signal },
    );
    return response.documents.results[0];
  }

  async meta({ query }) {
    const body = { ...query };
    const response = await this.post('/event/meta', body);
    return response;
  }

  async registerPredicate({ predicate }) {
    try {
      const metaResponse = await this.meta({ query: { predicate } });
      const { query } = metaResponse;
      const response = await this.post(
        `${this.config.es2vt}/register`,
        { query: { query, grid_type: 'centroid' } },
        { signal: this.context.abortController.signal },
      );
      return response.queryId;
    } catch (err) {
      console.log(err);
      return {
        err: {
          error: 'FAILED_TO_REGISTER_PREDICATE',
        },
        predicate: null,
      };
    }
  }
}

export default EventAPI;
