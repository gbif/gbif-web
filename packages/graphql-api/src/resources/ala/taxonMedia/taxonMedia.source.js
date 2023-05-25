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

  async getRepresentativeImages({ taxon, size, from, params }) {
    let query = `lsid:${taxon}`;

    // Append any additional filters to the query string
    Object.entries(params?.query || {}).forEach(([key, value]) => {
      query += ` AND ${key}:${value}`;
    });

    const searchParams = new URLSearchParams({
      q: query,
      fq: 'multimedia:"Image"',
      facet: 'off',
      sort: 'identification_qualifier_s',
      dir: 'asc',
      im: true,
      start: from || 0,
      pageSize: size || 10,
    });

    // Append any additional filters to the search params
    Object.entries(params?.search || {}).forEach(([key, value]) => {
      searchParams.append(key, value);
    });

    // Append filter queries
    [
      '-type_status:*',
      '-basis_of_record:PreservedSpecimen',
      '-identification_qualifier_s:"Uncertain"',
      'geospatial_kosher:true',
      '-user_assertions:50001',
      '-user_assertions:50005',
      ...Object.entries(params?.filter || {}).map(
        ([key, value]) => `${key}:${value}`,
      ),
    ].forEach((filter) => searchParams.append('fq', filter));

    // Perform the occurrence search
    const { occurrences } = await this.get(
      `/occurrences/search?${searchParams.toString()}`,
    );
    if (occurrences.length < 1) return [];

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
