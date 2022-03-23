
import { jsx } from '@emotion/react';
import React from "react";
import { Properties, Button } from "../../../../components";
import { HyperText } from "../../../../components";

const { Term: T, Value: V } = Properties;

export function Citation({
  data = {},
  loading,
  error,
  ...props
}) {
  const { dataset } = data;
  const doi = dataset.doi;
  return dataset?.citation?.text ? (
    <>
      <HyperText text={dataset.citation.text} />
      {doi && <div style={{marginTop: '1em'}}>
        <Button as="a" href={`https://data.crosscite.org/application/x-research-info-systems/${doi}`} look="primaryOutline" style={{marginRight: '1em'}}>RIS</Button>
        <Button as="a" href={`https://data.crosscite.org/application/x-bibtex/${doi}`} look="primaryOutline">BibTex</Button>
      </div>}
    </>
  ) : null;
}

