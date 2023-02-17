import { jsx, css } from '@emotion/react';
import React from 'react';
import { Properties, Term as T, Value as V, Property } from '../../../components/Properties/Properties';
import { Card, CardHeader2 } from '../../shared';
import { prettifyString } from '../../../utils/labelMaker/config2labels';

export function Provenance({
  specimen,
  ...props
}) {
  return <Card padded={false} {...props}>
    <div css={css`padding: 12px 24px;`}>
      <CardHeader2>Provenance</CardHeader2>
      <div css={css`margin-top: 12px;`}>
        <div style={{ marginBottom: 24 }}>
          Data mediated by GBIF has a provenance trail, who pulished it, who endorsed the published, where is the publisher located, what is the name of the dataset, the institution etc. Read more about the GBIF publishing model
        </div>
        <div css={css`margin-bottom: 12px; margin-top: -12px; border-radius: 6px; background: #eee; font-size: 12px; padding: 10px;`}>
          Currently this section is mocked up with static sample data
        </div>
        <Properties dense>
          <Property label="Endorsing node" value="SomeBifNode" />
          <Property label="Publisher" value="Some publisher" />
          <Property label="Dataset" value="Some dataset" />
          <Property label="Institution" value="Some institution" />
          <Property label="Collection" value="Some collection" />
          <Property label="Dataset" value="Some dataset" />
        </Properties>
      </div>
    </div>
  </Card>
};
