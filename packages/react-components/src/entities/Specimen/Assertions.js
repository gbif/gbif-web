import { jsx, css } from '@emotion/react';
import React from 'react';
import { Classification, Properties } from '../../components';
import { Term, Value } from '../../components/Properties/Properties';
import { Card, CardHeader2 } from '../shared';
import { DataTable } from './DataTable';

export function Assertions({
  id,
  ...props
}) {
  return <Card padded={false} css={css`margin-bottom: 24px;`}>
    <div css={css`padding: 12px 24px;`}>
      <CardHeader2>Assertions</CardHeader2>
    </div>
    <DataTable></DataTable>
  </Card>
};

