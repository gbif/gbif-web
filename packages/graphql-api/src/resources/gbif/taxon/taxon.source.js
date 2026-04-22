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

  async taxonSearch({ datasetKey, query }) {
    const response = await this.get(
      `/taxon/search/${datasetKey}`,
      stringify(query, { indices: false }),
    );
    response._query = query;
    response._datasetKey = datasetKey;
    return response;
  }

  async getDatasetTree({ datasetKey }) {
    return this.get(`/taxon/tree/${datasetKey}`);
  }

  async getTaxon({ datasetKey, key }) {
    return this.get(`/taxon/${datasetKey}/${key}`);
  }

  async getTaxonInfo({ datasetKey, key }) {
    return this.get(`/taxon/${datasetKey}/${key}/info`).then((response) => {
      // add logic to add isNamePublishedIn field to the bibliographic item if it matches the taxon namePublishedInID
      const { taxon } = response;
      const namePublishedInID = taxon?.namePublishedInID;
      if (namePublishedInID && response.bibliography) {
        response.bibliography.forEach((item) => {
          item.isNamePublishedIn = item.referenceID === namePublishedInID;
        });
      }
      // sort bibliography so that the item with isNamePublishedIn true is first
      if (response.bibliography) {
        response.bibliography.sort((a, b) => {
          if (a.isNamePublishedIn && !b.isNamePublishedIn) {
            return -1;
          }
          if (!a.isNamePublishedIn && b.isNamePublishedIn) {
            return 1;
          }
          return 0;
        });
      }

      // next we need to enrich the homotypic synonyms with the boolean isOriginalNameUsage if it match the taxon.originalNameUsageID
      const originalNameUsageID = taxon?.originalNameUsageID;
      if (originalNameUsageID && response?.synonyms?.homotypic) {
        response.synonyms.homotypic.forEach((item) => {
          item.isOriginalNameUsage = item.taxonID === originalNameUsageID;
        });
      }
      if (originalNameUsageID && response?.synonyms?.heterotypic) {
        response.synonyms.heterotypic.forEach((item) => {
          item.isOriginalNameUsage = item.taxonID === originalNameUsageID;
        });
      }

      return response;
    });
  }

  async getRelatedTaxonInfo({ datasetKey, key }) {
    return this.get(`/taxon/${datasetKey}/${key}/relatedInfo`);
  }

  async getTaxGroups() {
    return this.get('https://api.checklistbank.org/vocab/taxgroup');
  }

  async getRelated({ datasetKey, key, query = {} }) {
    return this.get(`/taxon/${datasetKey}/${key}/related`, query);
  }

  async getChildren({ datasetKey, key, query = {} }) {
    return this.get(`/taxon/tree/${datasetKey}/${key}/children`, query);
  }

  async getParents({ datasetKey, key, query = {} }) {
    return this.get(`/taxon/tree/${datasetKey}/${key}`, query);
  }

  async taxonBreakdown({ datasetKey, key }) {
    return this.get(`/taxon/${datasetKey}/${key}/breakdown`);
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

  async getTaxonOccurrenceMedia({
    taxonKey,
    checklistKey = this.config.defaultChecklist,
    limit,
    offset,
    mediaType,
  }) {
    return this.get(
      `${this.config.apiv1}/occurrence/experimental/multimedia/species/${checklistKey}/${taxonKey}/`,
      { limit, offset, mediaType },
    );
  }
}

export default TaxonAPI;
