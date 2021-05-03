
import { jsx } from '@emotion/react';
import React from 'react';
import { Properties, HyperText } from '../../../../components'

const { Term: T, Value: V } = Properties;

export function Description({
  data = {},
  ...props
}) {
  const { dataset } = data;
  return <section>
    <h2>Description</h2>
    <HyperText text={dataset.description}/>
  </section>;
};