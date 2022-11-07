import {
  URLResolver,
  EmailAddressResolver,
  JSONResolver,
  GUIDResolver,
} from 'graphql-scalars';
import DateTimeResolver from './dateTime';
import LongResolver from './long';

export default {
  JSON: JSONResolver, // last resort type for unstructured data
  URL: URLResolver,
  DateTime: DateTimeResolver,
  EmailAddress: EmailAddressResolver,
  GUID: GUIDResolver,
  Long: LongResolver,
};
