/* eslint-disable class-methods-use-this */
import { getDefaultAgent } from '#/requestAgents';
import { RESTDataSource } from 'apollo-datasource-rest';
import axios from 'axios';

class TaxonMediaAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.apiv1;
    this.config = config;
  }

  willSendRequest(request) {
    request.headers.set('User-Agent', this.context.userAgent);
    request.headers.set('referer', this.context.referer);
    request.headers.set('Accept', 'application/json');
    request.agent = getDefaultAgent(this.baseURL, request.path);
  }

  async getRepresentativeImages({
    taxon,
    size = 1,
    from,
    params,
    dataSources,
  }) {
    // get taxon information first, as we will use that to decide what services to use
    // const taxonInfo = await dataSources.taxonAPI.getTaxonByKey({ key: taxon });

    // get a random occurrence from iNaturalist
    const inatOccurrence =
      await dataSources.occurrenceAPI.searchOccurrenceDocuments({
        query: {
          limit: 1,
          predicate: {
            type: 'and',
            predicates: [
              // first filer on taxon
              {
                type: 'equals',
                key: 'taxonKey',
                value: taxon,
              },
              // secondly filter on inat datasetKey
              {
                type: 'equals',
                key: 'datasetKey',
                value: '50c9509d-22c7-4a22-a47d-8c48425ef4a7', // hardcoded key for iNaturalist
              },
            ],
          },
        },
      });

    // if inat fails, then log and ignore
    const inatTaxonId = inatOccurrence?.results[0]?.taxonID;
    try {
      if (inatTaxonId) {
        // search inaturalist API for that taxon // https://api.inaturalist.org/v1/taxa/{TAXON_KEY}
        const inatTaxa = (
          await axios.get(`https://api.inaturalist.org/v1/taxa/${inatTaxonId}`)
        ).data;

        const properlyLicencedImages = (inatTaxa?.results[0].taxon_photos || [])
          .filter(
            (x) =>
              [
                'cc0',
                'cc-by-nc',
                'cc-by',
                'cc-by-nc-sa',
                'cc-by-nc-sa',
                'cc-by-nc-nd',
              ].includes(x?.photo?.license_code) ||
              (x?.photo?.license_code || '').startsWith('cc-by'),
          )
          .map((x) => mapInaturalistToAudobon(x.photo));

        if (properlyLicencedImages.length > 0) {
          // return first n images. where n is the size parameter
          return properlyLicencedImages.slice(0, size);
        }
      }
    } catch (err) {
      // console.log(err);
    }

    // get media from the gbif api v1 taxon/key/media endpoint
    const checklistMedia = await dataSources.taxonAPI.getTaxonDetails({
      key: taxon,
      resource: 'media',
    });
    const checklistResults = checklistMedia.results.map((x) => ({
      identifier: x.identifier,
      format: x.format,
      accessURI: x.identifier,
      accessOriginalURI: x.identifier,
      creator: x.creator,
      rightsHolder: x.rightsHolder,
    }));

    if (checklistResults.length > 0) {
      // return first n images. where n is the size parameter
      return checklistResults.slice(0, size);
    }

    // else return a random image from the occurrence search
    const occurrenceMedia =
      await dataSources.occurrenceAPI.searchOccurrenceDocuments({
        query: {
          limit: size,
          predicate: {
            type: 'and',
            predicates: [
              {
                type: 'equals',
                key: 'taxonKey',
                value: taxon,
              },
              // ensure that there is an image
              {
                type: 'equals',
                key: 'mediaType',
                value: 'StillImage',
              },
            ],
          },
        },
      });
    return occurrenceMedia.results
      .map((x) => ({
        format: x.media[0].format,
        accessURI: x.media[0].identifier,
        accessOriginalURI: x.media[0].identifier,
      }))
      .slice(0, size);
  }
}

export default {
  dataSource: {
    taxonMediaAPI: TaxonMediaAPI,
  },
};

function mapInaturalistToAudobon(photo) {
  return {
    identifier: photo.id,
    type: 'StillImage',
    title: photo.attribution,
    accessURI: photo.url,
    accessOriginalURI: photo.original_url,
    format: 'image/jpeg',
    pixelXDimension: photo.original_dimensions.width,
    pixelYDimension: photo.original_dimensions.height,
  };
}
