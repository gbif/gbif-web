/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */

export default {
  Query: {
    taxonMedia: (parent, { key }, { dataSources }) =>
      dataSources.inatAPI
        .getRepresentativeImage({ taxon: key })
        .then((results) =>
          results.map((result) => ({
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
          })),
        ),
  },
};
