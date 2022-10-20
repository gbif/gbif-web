import { RESTDataSource } from 'apollo-datasource-rest';
import buildQuery from './helpers/buildQuery';

class ImagesAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.ala.apiImages;
  }

  async getMeta(identifier) {
    const meta = await this.get(`/ws/image/${identifier}`);

    // Swap empty strings with null values
    Object.keys(meta).forEach((key) => {
      if (meta[key] === '') meta[key] = null;
    });

    return meta;
  }

  async searchImages(args) {
    // console.log(args, `/search?${buildQuery(args)}`);
    const data = await this.get(`/ws/search?${buildQuery(args)}`);

    const out = {
      _endpoint: this.baseURL,
      facet: {
        _q: args.search,
        ...data.facets,
      },
      ...data,
    };

    // Append the filter query attribute
    if (args.filters) {
      out.fq = args.filters;
      out.facet._fq = args.filters;
    }

    return out;
  }

  async searchFacet(facet, args) {
    // console.log(args, `/facet?${buildQuery(args)}`);
    return this.get(
      `/ws/facet?${buildQuery({
        facet,
        ...args,
      })}`,
    );
  }
}

export default ImagesAPI;
