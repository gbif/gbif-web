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
      q: `taxonConceptID:${taxon}`,
      fq: 'multimedia:"Image"',
      facet: 'off',
      sort: 'identificationQualifier',
      dir: 'asc',
      im: true,
      start: from || 0,
      pageSize: size || 10,
    });

    // Append filter queries
    [
      '-typeStatus:*',
      '-basisOfRecord:PreservedSpecimen',
      '-identificationQualifier:"Uncertain"',
      'spatiallyValid:true',
      '-userAssertions:50001',
      '-userAssertions:50005',
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
      .map((occ) => ({
        ...occ,
        imageMetadata: {
          ...(occ.imageMetadata?.[0] || {}),
          ...images[occ.image],
        },
      }))
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
            metadataDate: imageMetadata.dateUploaded,
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
            createDate: imageMetadata.created,
            accessURI: imageMetadata.thumbUrl,
            accessOriginalURI: imageMetadata.imageUrl,
            format: imageMetadata.mimetype,
            hashFunction: imageMetadata.contentMD5Hash ? 'MD5' : null,
            hashValue: imageMetadata.contentMD5Hash,
            pixelXDimension: imageMetadata.width,
            pixelYDimension: imageMetadata.height,
          };
        },
      );
  }
}

export default TaxonMediaAPI;
