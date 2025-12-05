
import { jsx } from '@emotion/react';
import React from "react";
import { Properties, Button, Prose } from "../../../../components";
import { HyperText } from "../../../../components";
import * as sharedStyles from '../../../shared/styles';

export function Citation({
  data = {},
  loading,
  error,
  ...props
}) {
  const { dataset } = data;
  const doi = dataset.doi;
  return dataset?.citation?.text ? (
    <Prose css={sharedStyles.cardProse}>
      <HyperText text={dataset.citation.text} />
      {doi && <div style={{marginTop: '1em'}}>
        <Button as="a" href={`https://data.crosscite.org/application/x-research-info-systems/${doi}`} look="primaryOutline" style={{marginRight: '1em'}}>RIS</Button>
        <Button as="a" href={`https://data.crosscite.org/application/x-bibtex/${doi}`} look="primaryOutline">BibTex</Button>
      </div>}
    </Prose>
  ) : null;
}

