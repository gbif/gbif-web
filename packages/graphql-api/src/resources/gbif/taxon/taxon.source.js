import { stringify } from 'qs';
import { getTaxonAgent } from '@/requestAgents';
import QueuedRESTDataSource from '@/QueuedRESTDataSource.js';

class TaxonAPI extends QueuedRESTDataSource {
  constructor(config) {
    super({
      // notice that this only is used if the enQueue option is set to true in the request
      concurrency: 10, // Maximum concurrent requests
    });
    this.baseURL = config.apiv2;
    this.config = config;
  }

  willSendRequest(request) {
    request.headers.set('User-Agent', this.context.userAgent);
    request.headers.set('referer', this.context.referer);
    request.agent = getTaxonAgent(this.baseURL, request.path);
  }

  async getTaxon({ datasetKey, key }) {
    return this.get(`/taxon/${datasetKey}/${key}`);
  }

  async getTaxonInfo({ datasetKey, key }) {
    return this.get(`/taxon/${datasetKey}/${key}/info`);
  }

  async getRelatedTaxonInfo({ datasetKey, key }) {
    return this.get(`/taxon/${datasetKey}/${key}/relatedInfo`);
  }

  async taxonBreakdown({ datasetKey, key }) {
    return this.get(`/taxon/${datasetKey}/${key}/breakdown`).then(
      (response) => {
        if (typeof response === 'string') {
          // TODO taxonapi remove when api is fixed https://github.com/gbif/taxon-ws/issues/12
          return JSON.parse(response);
        }
        return response;
      },
    );
  }

  async getChecklistMetadata({ checklistKey = this.config.defaultChecklist }) {
    return this.get(
      `/species/match/metadata?`,
      stringify({ checklistKey }, { indices: false }),
    );
  }

  async getChecklistBankDataset({ clbDatasetKey }) {
    return this.get(`${this.config.checklistBank}/dataset/${clbDatasetKey}`);
  }

  async getSpeciesMatchByUsageKey({
    usageKey,
    checklistKey = this.config.defaultChecklist,
  }) {
    const isIncertaeSedis = usageKey === 0 || usageKey === '0';
    return this.get(
      `/species/match?`,
      stringify(
        { checklistKey: isIncertaeSedis ? undefined : checklistKey, usageKey },
        { indices: false },
      ),
      { enQueue: true, signal: this.context.abortController.signal },
    ).then((result) => {
      if (!result.usage) {
        return null;
      }
      // extract IUCN status if any
      const iucnEntry = result?.additionalStatus?.find(
        (x) => x.datasetAlias === 'IUCN',
      );
      return {
        ...result,
        checklistKey,
        iucnStatus: iucnEntry?.status,
        iucnStatusCode: iucnEntry?.statusCode,
      };
    });
  }

  async getSpeciesMatchByName({
    name,
    checklistKey = this.config.defaultChecklist,
  }) {
    return this.get(
      `/species/match?`,
      stringify({ checklistKey, scientificName: name }, { indices: false }),
    ).then((result) => {
      if (!result.usage) {
        return null;
      }

      return {
        ...result,
        checklistKey,
      };
    });
  }

  async getTaxonOccurrenceMedia({ taxonKey, limit, offset, mediaType }) {
    return this.get(
      `${this.config.apiv1}/occurrence/experimental/multimedia/species/${taxonKey}/`,
      { limit, offset, mediaType },
    );
  }
}

export default TaxonAPI;
