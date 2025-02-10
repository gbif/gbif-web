import { getOccurrenceAgent } from '#/requestAgents';
import { RESTDataSource } from 'apollo-datasource-rest';

class DownloadAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.apiv1;
  }

  willSendRequest(request) {
    request.agent = getOccurrenceAgent(this.baseURL, request.path);
  }

  async datasetDownloads({ query }) {
    const { datasetKey, ...params } = query;
    return this.get(`/occurrence/download/dataset/${datasetKey}`, params);
  }

  async getDownloadByKey({ key }) {
    return this.get(`/occurrence/download/${key}?statistics=true`).then(
      (res) => {
        return {
          ...res,
          request: {
            ...res.request,
            sql: 'SELECT \n  kingdom, kingdomKey, phylum, phylumKey, class, classKey, "order", orderKey, family, familyKey, genus, genusKey, species, speciesKey, "year", IF(ISNULL(kingdomKey), NULL, SUM(COUNT(*)) OVER (PARTITION BY kingdomKey)) AS kingdomCount, IF(ISNULL(phylumKey), NULL, SUM(COUNT(*)) OVER (PARTITION BY phylumKey)) AS phylumCount, IF(ISNULL(classKey), NULL, SUM(COUNT(*)) OVER (PARTITION BY classKey)) AS classCount, IF(ISNULL(orderKey), NULL, SUM(COUNT(*)) OVER (PARTITION BY orderKey)) AS orderCount, IF(ISNULL(familyKey), NULL, SUM(COUNT(*)) OVER (PARTITION BY familyKey)) AS familyCount, IF(ISNULL(genusKey), NULL, SUM(COUNT(*)) OVER (PARTITION BY genusKey)) AS genusCount,\n  COUNT(*) AS occurrences, MIN(GBIF_TemporalUncertainty(eventDate)) AS minTemporalUncertainty, MIN(COALESCE(coordinateUncertaintyInMeters, 1000)) AS minCoordinateUncertaintyInMeters\nFROM\n  occurrence \n WHERE  occurrence.occurrencestatus = \'PRESENT\' \nGROUP BY\n  taxonRank, taxonomicStatus, kingdom, kingdomKey, phylum, phylumKey, class, classKey, "order", orderKey, family, familyKey, genus, genusKey, species, speciesKey, "year"',
            machineDescription: {
              type: 'CUBE',
              signature:
                '574fa1c804eb3b8931b24327b1e988e69654df51b0e0c57c36e0d522f842a697',
              parameters: {
                taxonomy: 'SPECIES',
                temporal: 'YEAR',
                randomize: 'YES',
                higherGroups: [
                  'KINGDOM',
                  'PHYLUM',
                  'CLASS',
                  'ORDER',
                  'FAMILY',
                  'GENUS',
                ],
                includeTemporalUncertainty: 'YES',
                includeSpatialUncertainty: 'YES',
                predicate: {
                  type: 'equals',
                  key: 'OCCURRENCE_STATUS',
                  value: 'present',
                  matchCase: false,
                },
              },
            },
          },
        };
      },
    );
  }

  async getContributingDatasetsByDownloadKey({ key, query }) {
    return this.get(`/occurrence/download/${key}/datasets`, query);
  }

  /*
  getDownloadsByKeys({ downloadKeys }) {
    return Promise.all(
      downloadKeys.map(key => this.getDownloadByKey({ key })),
    );
  }
  */
}

export default DownloadAPI;
