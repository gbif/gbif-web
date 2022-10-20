import { RESTDataSource } from 'apollo-datasource-rest';

const urlSizeLimit = 2000; // use GET for requests that serialized is less than N characters

class OccurrenceAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.config = config.ala;
    this.baseURL = config.ala.apiEs;
  }

  willSendRequest(request) {
    // now that we make a public version, we might as well just make it open since the key is shared with everyone
    request.headers.set('Authorization', `ApiKey-v1 ${this.config.apiEsKey}`);
  }

  async searchOccurrenceDocuments({ query }) {
    const { documents } = await this.searchOccurrences({ query });
    return documents;
  }

  searchOccurrences = async ({ query }) => {
    const body = { ...query, includeMeta: true };
    let response;
    if (JSON.stringify(body).length < urlSizeLimit) {
      response = await this.get(
        '/occurrence',
        { body: JSON.stringify(body) },
        { signal: this.context.abortController.signal },
      );
    } else {
      response = await this.post('/occurrence', body, {
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

  async searchBiocache({ search, size, from, sort, facet, dir, filters }) {
    const params = new URLSearchParams();

    // Check for the existence of the supplied variables
    [
      { name: 'q', value: search },
      { name: 'pageSize', value: size, fallback: 20 },
      { name: 'start', value: from },
      { name: 'sort', value: sort },
      { name: 'facet', value: facet },
      { name: 'dir', value: dir },
    ].forEach(({ name, value, fallback }) => {
      if (value || fallback) params.append(name, value || fallback);
    });

    // Append data quality filters
    (filters || []).forEach((fq) => params.append('fq', fq));

    const apiQueryUrl = `${
      this.config.apiBiocache
    }/occurrences/search?${params.toString()}`;

    const data = await this.get(apiQueryUrl);

    // Map biocache fields to elastic fields
    return {
      ...data,
      occurrences: data.occurrences.map((occurrence) => ({
        ...occurrence,
        datasetKey: occurrence.dataResourceUid,
        datasetTitle: occurrence.dataResourceName,
      })),
    };
  }
}

export default OccurrenceAPI;
