import { jsx, css } from '@emotion/react';
import React from 'react';
import { Classification, HyperText, Properties } from '../../components';
import { Term as T, Value as V, Property } from '../../components/Properties/Properties';
import { Card, CardHeader2 } from '../shared';
import { ImBook as ReferenceIcon } from 'react-icons/im'
import { MdEdit } from 'react-icons/md';
import { TbCircleDot } from 'react-icons/tb';
import { prettifyEnum, prettifyString } from '../../utils/labelMaker/config2labels';

export function Organism({
  specimen,
  ...props
}) {
  const organism = specimen?.organism;
  if (!organism) return null;

  const occurrenceCount = organism?.occurrencesByOrganismId?.totalCount ?? 0;
  const scope = organism?.organismScope;
  const name = organism?.name?.entityByMaterialEntityId?.entityName;

  
  if (!scope && !name && occurrenceCount < 2) return null;

  return <Card padded={false} {...props}>
    <div css={css`padding: 12px 24px;`}>
      <CardHeader2>Organism</CardHeader2>
      <div css={css`margin-top: 12px;`}>
        <Properties dense>
          {name && <Property label="Name" value={name} />}
          {scope && <Property label="Scope" value={scope} />}
          {occurrenceCount > 1 && <Property label="Observations" value={occurrenceCount} />}
        </Properties>
      </div>
    </div>
  </Card>
};
