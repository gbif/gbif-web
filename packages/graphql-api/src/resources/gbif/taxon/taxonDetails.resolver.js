import md5 from 'md5';
import config from '../../../config';

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
  // TaxonOccurrenceMediaResult: {
  //   thumbor: (
  //     { identifier, occurrenceKey },
  //     { fitIn, width = '', height = '' },
  //   ) => {
  //     if (!identifier) return null;
  //     if (!occurrenceKey) return null;
  //     // do not use the thumbor service.
  //     // for occurrences we have a special url format for the occurrence images. This is in preparation for the new image service that will disable any unsafe urls
  //     // it also has a different cache purge strategy
  //     // see also https://github.com/gbif/gbif-web/issues/303
  //     try {
  //       const url = `${config.occurrenceImageCache}/${
  //         fitIn ? 'fit-in/' : ''
  //       }${width}x${height}/occurrence/${occurrenceKey}/media/${md5(
  //         identifier ?? '',
  //       )}`;
  //       return url;
  //     } catch (err) {
  //       return identifier;
  //     }
  //   },
  // },
};
