import { jsx, css } from '@emotion/react';
import React from 'react';
import { Properties, Term as T, Value as V, Property } from '../../../components/Properties/Properties';
import { Card, CardHeader2 } from '../../shared';
import { prettifyString } from '../../../utils/labelMaker/config2labels';

export function Identifiers({
  specimen,
  setSection,
  name = 'identifiers',
  ...props
}) {
  if (!specimen || !specimen?.identifiers?.length) {
    setSection(name, false);
    return null;
  }
  setSection(name, true);
  
  return <Card padded={false} {...props}>
    <div css={css`padding: 12px 24px;`}>
      <CardHeader2>Identifiers</CardHeader2>
      <div css={css`margin-top: 12px;`}>
        <Properties dense>
          {specimen?.identifiers?.map(x => <Property 
            label={prettifyString(x.identifierType)} 
            key={x.nodeId} 
            value={x.identifierValue} />)}
        </Properties>
      </div>
    </div>
  </Card>
};
