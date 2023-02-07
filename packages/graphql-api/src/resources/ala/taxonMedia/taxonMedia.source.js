/* eslint-disable class-methods-use-this */

import { RESTDataSource } from 'apollo-datasource-rest';

class TaxonMediaAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.ala.biocache;
    this.config = config;
  }

  willSendRequest(request) {
    request.headers.set('Accept', 'application/json');
  }

  async getRepresentativeImages({ taxon, size, from }) {
    const params = new URLSearchParams({
      q: `lsid:${taxon}`,
      fq: 'multimedia:"Image"',
      facet: 'off',
      sort: 'identification_qualifier_s',
      dir: 'asc',
      im: true,
      start: from || 0,
      pageSize: size || 10,
    });

    // Append filter queries
    [
      '-type_status:*',
      '-basis_of_record:PreservedSpecimen',
      '-identification_qualifier_s:"Uncertain"',
      'geospatial_kosher:true',
      '-user_assertions:50001',
      '-user_assertions:50005',
    ].forEach((filter) => params.append('fq', filter));

    // Perform the occurrence search
    const { occurrences } = await this.get(
      `/occurrences/search?${params.toString()}`,
    );

    const { results: images } = await this.post(
      `${this.config.ala.images}/getImageInfoForIdList`,
      JSON.stringify({
        imageIds: occurrences.map(({ image }) => image),
      }),
    );

    return occurrences
      .map((occ) => ({ ...occ, imageMetadata: images[occ.image] }))
      .map(
        ({
          scientificName,
          speciesGroups,
          occurrenceDetails,
          imageMetadata,
        }) => {
          return {
            identifier: imageMetadata.imageId,
            type: 'StillImage',
            // subtypeLiteral: null,
            title: imageMetadata.title || `Image of ${scientificName}`,
            // metadataDate: null,
            metadataLanguage: 'eng',
            metadataLanguageLiteral: 'English',
            providerManagedID: imageMetadata.imageId,
            rights: imageMetadata.rights || 'Unknown',
            owner: imageMetadata.rightsHolder,
            webStatement:
              imageMetadata.license?.includes('http') && imageMetadata.license,
            credit: imageMetadata.rights,
            creator: imageMetadata.creator,
            // providerLiteral: null,
            description: imageMetadata.description || occurrenceDetails,
            tag: speciesGroups.join(', '),
            // createDate: null,
            accessURI: imageMetadata.thumbUrl,
            accessOriginalURI: imageMetadata.imageUrl,
            format: imageMetadata.mimetype,
            // hashFunction: null,
            // hashValue: null,
            pixelXDimension: imageMetadata.width,
            pixelYDimension: imageMetadata.height,
          };
        },
      );
  }
}

export default TaxonMediaAPI;
