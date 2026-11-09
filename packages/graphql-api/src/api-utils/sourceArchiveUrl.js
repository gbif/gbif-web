import { encodePathSegment } from '../helpers/urlPath';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Build the upstream URL for a file in a dataset's source archive, or return null
// if the params are not safe to use.
//
// Express has already percent decoded the route params, so "..%2F" arrives as
// "../". Dataset keys are always UUIDs. File names come from publishers' data and
// can contain spaces and the like, so instead of a strict pattern they are encoded
// as a single path segment, which also rejects "/", "\", "." and "..".
export function sourceArchiveUrl(endpoint, datasetKey, fileName) {
  if (!UUID.test(String(datasetKey))) return null;
  try {
    return `${endpoint}/${datasetKey.toLowerCase()}/${encodePathSegment(fileName)}`;
  } catch (err) {
    return null;
  }
}

export default sourceArchiveUrl;
