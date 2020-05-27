import compose from "./compose";
import axios from '../axios';
// import ky from 'ky';


import env from './.env.json';

// const esEndpoint = '//es1.gbif-dev.org/some_fungi'
// const esEndpoint = '//c6n1.gbif.org:9200/occurrence'
// const endpoint = 'http://labs.gbif.org:7011';
const endpoint = 'http://labs.gbif.org:7019';

const query = (filters, size, from) => {
  let body = compose(filters)
    .size(size)
    .from(from)
    .build();
  // return axios.post(`${endpoint}/_search`, body, {});
  return axios.get(`${endpoint}/occurrence?apiKey=${env.apiKey}&mediaTypes=StillImage`);
};

// const build = (filters) => {
//   return compose(filters).build;
// }

export {
  query,
  compose,
  endpoint
};

/*
What would be the prefered query format
Ideally GET so that it can be cached.
And if it is a large query, then register the query with a token so that it is still GET.

The get can either be json or params.
params are more complex since we want prefilters (legume portal) and additional filters (images only).
That could be done by merging multiple filters. 
taxonKey=1&pre={legumes predicate}&pre={images predicate}
If we want to allow more complex filters than supported by GET api, then we have to use predicates instead of flat params

for simplicity i tend towards predicates. and using that as a query format as well.
*/