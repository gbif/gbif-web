import { jsx, css } from '@emotion/react';
import React from 'react';
import { Classification, Properties } from '../../components';
import { Term, Value } from '../../components/Properties/Properties';
import { Card, CardHeader2 } from '../shared';
import { ImBook as ReferenceIcon } from 'react-icons/im'
import { MdEdit } from 'react-icons/md';
import { TbCircleDot } from 'react-icons/tb';

export function Material({
  id,
  ...props
}) {
  return <Card padded={false} {...props}>
    <div css={css`padding: 12px 24px;`}>
      <CardHeader2>Preserved specimen</CardHeader2>
      <div css={css``}>
        
      </div>
      <div css={css`margin-top: 12px;`}>
        <Properties>
          <Term>Catalog number</Term>
          <Value>C-F-5398</Value>

          <Term>Other catalog numbers</Term>
          <Value>F-46664</Value>

          <Term>Record number</Term>
          <Value>fhl248976</Value>

          <Term>Preparations</Term>
          <Value>Dried</Value>
        </Properties>
      </div>
    </div>
  </Card>
};

