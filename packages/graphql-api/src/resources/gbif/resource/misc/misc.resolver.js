import Thumbor from 'thumbor';
import config from '../../../../config';

const thumbor = new Thumbor(config.thumborSecurityKey, config.thumbor ?? 'https://api.gbif.org/v1/image');

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
  ImageFile: {
    thumbor: ({ url }, { fitIn, width = '', height = '' }) => {
      let img = thumbor.setImagePath(`http:${url}`);
      if (fitIn) {
        img = img.fitIn(width, height);
      } else {
        img = img.resize(width, height);
      }
      return img.buildUrl();
    }
  },
  DocumentAssetFile: {
    volatile_documentType: ({ contentType }) => {
      // if starts with image/ then it is an image
      if (contentType.startsWith('image/')) {
        return 'image';
      } else if (contentType.includes('spreadsheetml')) {
        return 'xls';
      } else if (contentType.includes('video')) {
        return 'video';
      } else if (contentType.includes('audio')) {
        return 'audio';
      }

      switch (contentType) {
        case 'application/pdf':
          return 'pdf';

        // powerpoint
        case 'application/vnd.ms-powerpoint':
          return 'ppt';
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
          return 'ppt';

        // excel
        case 'application/vnd.ms-excel':
          return 'xls';


        // word/doc
        case 'application/msword':
          return 'doc';
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          return 'doc';

        // archive
        case 'application/zip':
          return 'archive';
        case 'application/x-tar':
          return 'archive';

        default:
          return 'unknown';
      }
    }
  }
}