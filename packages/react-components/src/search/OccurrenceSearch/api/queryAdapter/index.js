import compose from "./compose";
import axios from '../axios';

// const esEndpoint = '//es1.gbif-dev.org/some_fungi'
// const esEndpoint = '//c6n1.gbif.org:9200/occurrence'
const endpoint = '//labs.gbif.org:7011'

const query = (filters, size, from) => {
  let body = compose(filters)
    .size(size)
    .from(from)
    .build();
  return axios.post(`${endpoint}/_search`, body, {});
};

// const build = (filters) => {
//   return compose(filters).build;
// }

export {
  query,
  compose,
  endpoint
};
