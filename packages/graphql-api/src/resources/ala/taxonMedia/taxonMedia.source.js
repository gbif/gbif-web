/* eslint-disable class-methods-use-this */

import { RESTDataSource } from 'apollo-datasource-rest';

class TaxonMediaAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.alaBiocache;
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
      pageSize: (size || 10) + 10, // add a buffer for occurrenes without provided metadata
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
    return occurrences
      .filter((occ) => Boolean(occ.imageMetadata))
      .map(
        ({ scientificName, speciesGroups, occurrenceDetails, imageMetadata }) =>
          imageMetadata.map((meta) => {
            return {
              identifier: meta.imageIdentifier,
              type: 'Photograph',
              subtypeLiteral: meta.type,
              title: `Image of ${scientificName}`,
              metadataDate: meta.dateUploaded,
              metadataLanguage: 'eng',
              metadataLanguageLiteral: 'English',
              providerManagedID: meta.imageIdentifier,
              rights: meta.recognisedLicense?.acronym || 'Unknown',
              owner: meta.creator,
              credit: meta.rightsHolder,
              creator: meta.creator,
              providerLiteral: meta.publisher,
              description: occurrenceDetails,
              tag: speciesGroups.join(', '),
              createDate: meta.dateTaken,
              accessURI: meta.squareThumbUrl,
              accessOriginalURI: meta.imageUrl,
              format: meta.extension,
              hashFunction: 'MD5',
              hashValue: meta.contentMD5Hash,
              pixelXDimension: meta.width,
              pixelYDimension: meta.height,
            };
          }),
      )
      .flat()
      .slice(0, size);
  }
}

export default TaxonMediaAPI;
