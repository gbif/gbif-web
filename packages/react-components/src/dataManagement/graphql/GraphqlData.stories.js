import React, { useState, useEffect } from 'react';
import readme from './README.md';
import { StyledProse } from '../../components/typography/StyledProse';
import { useQuery, GraphqlContext, GraphqlClient } from './index';
import ThemeContext from '../../style/themes/ThemeContext';

export default {
  title: 'Data management/GraphQL'
};

export const Intro = () => <>
  <StyledProse source={readme}></StyledProse>
</>;

const GET_DATASETS = `
query datasets($limit: Int=4){
  datasetSearch(limit: $limit) {
    results {
      title
    }
  }
}
`;

const client = new GraphqlClient({
  endpoint: 'http://labs.gbif.org:7022/graphql'
});

export const QueryContext = () => <GraphqlContext.Provider value={client}>
  <HookExample />
</GraphqlContext.Provider>

QueryContext.story = {
  name: 'Context + hook',
};

const HookExample = () => {
  const { data, loading, error } = useQuery(GET_DATASETS);
  return <div>
    <pre>data: {JSON.stringify({ loading, error, data }, null, 2)}</pre>
  </div>
}

export const ClientExample = () => {
  const [response, setResponse] = useState({ loading: true });

  useEffect(() => {
    // code to run on component mount
    const { promise, cancel } = client.query({ query: GET_DATASETS });
    promise
      .then(response => {
        if (response?.error?.isCanceled?.message !== 'UNMOUNT')
          setResponse(response)
      })
      .catch(console.log);
    // remember some function to clean up when component unmounts
    return () => cancel('UNMOUNT');
  }, []);

return <pre>{JSON.stringify(response, null, 2)}</pre>
}
