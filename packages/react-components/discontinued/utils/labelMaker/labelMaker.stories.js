import React, { useContext } from 'react';
import axios from 'axios';
import { ApiContext } from '../../dataManagement/api';
import { config2labels } from './config2labels';
import { rangeOrEqualLabel } from './rangeOrEqualLabel';
import readme from './README.md';
import { StyledProse } from '../../components/typography/StyledProse';

/*
I'm not sure what to think of this. 
It makes it easier to add 50 of these when in config, but the abstraction makes 
it more difficult to understand.

This is really just a way to generate components of the form
<MyPrettyLabel id="SOME_ID" />
that will show a nice human readable name for 'SOME_ID'.
*/

const config = {
  // labelHandle: config
  basisOfrecord: {
    type: 'TRANSLATION',
    template: id => `enums.basisOfRecord.${id}`
  },
  number: {
    type: 'TRANSFORM',
    transform: ({ id, locale }) => id.toLocaleString(locale)
  },
  taxonKey: {
    type: 'GQL',
    query: `query label($id: ID!){
      taxon(key: $id) {
        formattedName
      }
    }`,
    transform: result => ({ title: result.data.taxon.formattedName }),
    isHtmlResponse: true
  },
  publisherKey: {
    type: 'ENDPOINT',
    template: ({ id, api }) => `${api.v1.endpoint}/organization/${id}`,
    transform: result => ({ title: result.title })
  },
  datasetKey: {
    type: 'CUSTOM_ENDPOINT',
    get: ({ id }) => axios
      .get('http://api.gbif.org/v1/dataset/' + id)
      .then(result => ({ title: result.data.title }))
  },
  year: {
    type: 'CUSTOM',
    component: rangeOrEqualLabel('interval.year')
  },
}

// for reasons beyond me storybook cannot read context in its main story. you have to nest it in a component
export const Example = () => <ExampleNested />

const ExampleNested = () => {
  const apiContext = useContext(ApiContext);
  const components = config2labels(config, apiContext);

  const BasisOfRecordLabel = components.basisOfrecord;
  const NumberLabel = components.number;
  const TaxonLabel = components.taxonKey;
  const PublisherLabel = components.publisherKey;
  const DatasetLabel = components.datasetKey;
  const YearLabel = components.year;
  return <>
    <p><span style={{color: '#bbb'}}>Translation: HUMAN_OBSERVATION => </span><BasisOfRecordLabel id="HUMAN_OBSERVATION" /></p>
    <p><span style={{color: '#bbb'}}>Number: 1234567890 => </span><NumberLabel id={1234567890} /></p>
    <p><span style={{color: '#bbb'}}>GQL endpoint: 6263708 => </span><TaxonLabel id={6263708} /></p>
    <p><span style={{color: '#bbb'}}>Endpoint: 69895499-7b24-47cf-9d40-353643e74866 => </span><PublisherLabel id={'69895499-7b24-47cf-9d40-353643e74866'} /></p>
    <p><span style={{color: '#bbb'}}>Custom endpoint: c3413793-cd8e-4f74-b0b7-e1f0c155102c => </span><DatasetLabel id={'c3413793-cd8e-4f74-b0b7-e1f0c155102c'} /></p>
    <p><span style={{ color: '#bbb' }}>Custom: {'{'} type: "equals", value: 1900 {'}'} => </span><YearLabel id={{ type: "equals", value: 1900 }} /></p>
    <p><span style={{ color: '#bbb' }}>Custom: {'{'} type: "range", value: {'{'} gt: 1900, lt: 2000 {'}'} {'}'} => </span><YearLabel id={{ type: "range", value: { gt: 1900, lt: 2000 } }} /></p>
  </>
}

Example.story = {
  name: 'Label maker',
};

export default {
  title: 'Utils/LabelMaker',
};