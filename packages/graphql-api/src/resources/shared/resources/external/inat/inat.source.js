/* eslint-disable class-methods-use-this */

import { RESTDataSource } from 'apollo-datasource-rest';

class PersonAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.inat;
  }

  willSendRequest(request) {
    request.headers.set('Accept', 'application/json');
  }

  async getRepresentativeImages({ taxon }) {
    return ((await this.get(`/taxa?q=${taxon}`)).results || []).map(
      (result) => ({
        identifier: result.default_photo.id.toString(),
        type: 'StillImage',
        subtypeLiteral: 'Photograph',
        title: result.name,
        rights: result.default_photo.license_code || 'unknown',
        Credit: result.default_photo.attribution,
        providerLiteral: 'iNaturalist',
        description: `Photo of ${result.name}`,
        accessURI: result.default_photo.url,
        accessOriginalURI: result.default_photo.medium_url,
        format: result.default_photo.url
          .substring(result.default_photo.url.lastIndexOf('.') + 1)
          .toLowerCase(),
        PixelXDimension: result.default_photo.original_dimensions.width,
        PixelYDimension: result.default_photo.original_dimensions.height,
      }),
    );
  }
}

export default PersonAPI;
