import React, { useState } from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { GraphqlData } from './GraphqlData';
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';
import useQuery from '../../search/OccurrenceSearch/api/graphqlClient/useQuery';

export default {
  title: 'Components/GraphqlData',
  component: GraphqlData,
};

const GET_DATASETS = `
query datasets($limit: Int=3){
  datasetSearch(limit: $limit) {
    results {
      key
      title
    }
  }
}
`;

const Test = ({ variables, lazyLoad, ...props }) => {
  const { data, loading, error, load, cancel } = useQuery(GET_DATASETS, { lazyLoad: lazyLoad, variables });

  return <div>
    <div>Loading: {loading ? 'true' : 'false'}</div>
    <div>error: {error ? 'true' : 'false'}</div>
    <button onClick={e => load({ variables: { limit: 4 } })}>Load more</button>
    <button onClick={e => cancel()}>Cancel request</button>
    <pre>data: {JSON.stringify(data, null, 2)}</pre>
    <pre>variables: {JSON.stringify(variables, null, 2)}</pre>
    <pre>error: {JSON.stringify(error, null, 2)}</pre>
  </div>
}

export const Example = () => {
  const [lazy, setLazy] = useState(false);
  const [query, setQuery] = useState({ limit: 2 });
  const [visible, setVisible] = useState(false);

  return <>
    <button onClick={e => setLazy(!lazy)}>toggle lazy: {lazy ? 'true' : 'false'}</button>
    <button onClick={e => setQuery({ limit: Math.floor(Math.random() * 10) })}>change query</button>
    <button onClick={e => setVisible(!visible)}>toggle visibility</button>
    {visible && <Test variables={query} lazyLoad={lazy} />}
  </>
}

Example.story = {
  name: 'GraphqlData',
};


// // OPTIONS
// const options = {
//   primary: 'primary',
//   primaryOutline: 'primaryOutline',
//   outline: 'outline',
//   danger: 'danger',
// };
// type={select('Type', options, options.primary)}

// // BOOLEAN
// boolean("loading", false)

// // TEXT
// {text('Text', 'GraphqlData text')}