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
  setSection,
  name = 'organism',
  ...props
}) {
  const organism = specimen?.organism;
  if (!organism) {
    setSection(name, false);
    return null;
  }
  setSection(name, true);

  const occurrenceCount = organism?.occurrencesByOrganismId?.totalCount ?? 0;
  const scope = organism?.organismScope;
  const organismName = organism?.name?.entityByMaterialEntityId?.entityName;

  
  if (!scope && !organismName && occurrenceCount < 2) return null;

  return <Card padded={false} {...props}>
    <div css={css`padding: 12px 24px;`}>
      <CardHeader2>Organism</CardHeader2>
      <div css={css`margin-top: 12px;`}>
        <Properties dense>
          {organismName && <Property label="Name" value={organismName} />}
          {scope && <Property label="Scope" value={scope} />}
          {occurrenceCount > 1 && <Property label="Observations" value={occurrenceCount} />}
        </Properties>
      </div>
    </div>
  </Card>
};
