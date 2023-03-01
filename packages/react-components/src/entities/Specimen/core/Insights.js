import { jsx, css } from '@emotion/react';
import React from 'react';
import { Properties, Term as T, Value as V, Property } from '../../../components/Properties/Properties';
import { Card, CardHeader2 } from '../../shared';
import { prettifyString } from '../../../utils/labelMaker/config2labels';

export function Insights({
  specimen,
  ...props
}) {
  if (!specimen || !specimen?.identifiers?.length) return null;
  const currentScientificName = specimen?.identifications?.current?.taxa?.[0]?.scientificName;

  return <Card padded={false} {...props}>
    <div css={css`padding: 12px 24px;`}>
      <CardHeader2>Did you know?</CardHeader2>
      <div css={css`margin-bottom: 12px; margin-top: -12px; border-radius: 6px; background: #eee; font-size: 12px; padding: 10px;`}>
        Would it make sense to try to say something about this material in relation to the rest of the data in GBIF? Examples below;
      </div>
      <div css={css`margin-top: 12px; font-style: italic; color: #555;`}>
        <p>This is the only material of <span style={{ fontWeight: 600 }}>{currentScientificName}</span> shared via GBIF</p>
        <p>This is the only material of this genus in this collection</p>
        <p>There are only 3 specimens of this taxon shared with GBIF</p>
        <p>This is the only material of this taxon in a US collection</p>
        <p>This is the only material of this taxon collected in India</p>
        <p>This is the first known collected material of this species</p>
    </div>
  </div>
  </Card >
};
