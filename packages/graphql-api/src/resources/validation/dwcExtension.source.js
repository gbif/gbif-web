import { RESTDataSource } from '@/RESTDataSource';

const ONE_DAY = 24 * 3600;

// extensions.json lists every version of an extension; prefer the latest
export function toExtensionMap(body) {
  const list = body?.extensions;
  if (!Array.isArray(list)) return {};
  const extensions = {};
  list.forEach((extension) => {
    const identifier = extension?.identifier;
    if (typeof identifier !== 'string') return;
    if (!extensions[identifier] || (extension.isLatest && !extensions[identifier].isLatest)) {
      extensions[identifier] = extension;
    }
  });
  return extensions;
}

class DwcExtensionAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.rsGbifOrg ?? 'https://rs.gbif.org';
  }

  // shared by every file of a report, so fetch it once per request
  getExtensions() {
    if (!this.extensions) {
      this.extensions = this.get('/extensions.json', undefined, {
        cacheOptions: { ttl: ONE_DAY },
      })
        .then(toExtensionMap)
        .catch(() => ({}));
    }
    return this.extensions;
  }

  async getExtension(rowType) {
    if (typeof rowType !== 'string') return null;
    const extensions = await this.getExtensions();
    return extensions[rowType] ?? null;
  }
}

export default DwcExtensionAPI;
