import compose from "./compose";
import axios from '../axios';
const graphqlEndpoint = 'http://localhost:4000';

const query = ({filter, useV1, config}) => {
  return axios.post(`${graphqlEndpoint}/graphql`, body);
};

export {
  query
};