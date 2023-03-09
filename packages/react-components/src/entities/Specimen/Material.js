import { jsx, css } from '@emotion/react';
import React from 'react';
import { Classification, HyperText, Properties } from '../../components';
import { Term as T, Value as V, Property } from '../../components/Properties/Properties';
import { Card, CardHeader2 } from '../shared';
import { ImBook as ReferenceIcon } from 'react-icons/im'
import { MdEdit } from 'react-icons/md';
import { TbCircleDot } from 'react-icons/tb';
import { prettifyEnum, prettifyString } from '../../utils/labelMaker/config2labels';
import { GeneralInfo } from './core/GeneralInfo';

export function Material({
  specimen,
  ...props
}) {
  if (!specimen) return null;
  return <Card padded={false} {...props}>
    <div css={css`padding: 12px 24px;`}>
      <CardHeader2>Catalogue item <span style={{display: 'none', marginLeft: 12, color: '#ddd'}}>{prettifyEnum(specimen.catalogItem.type)}</span></CardHeader2>
      <div css={css`margin-top: 12px;`}>
        <Properties dense>
          {['preparations',
            'catalogNumber',
            'otherCatalogNumbers',
            'recordedBy',
            'recordedById',
            'disposition',
            'recordNumber',
            'institutionCode',
            'collectionCode',
            'ownerInstitutionCode',]
            .filter(x => !!specimen.catalogItem[x]).map(x => <Property label={prettifyString(x)} key={x} value={specimen.catalogItem[x]} />)}
          {/* <Property label="Organism scope" value={specimen?.organism?.organismScope} />
          <Property label="Organism name" value={specimen?.organism?.name?.entityByMaterialEntityId?.entityName} /> */}
          {specimen?.catalogItem?.associatedSequences && <Property label="Associated sequences">
            {specimen?.catalogItem?.associatedSequences.split('|').map(x => <HyperText key={x} inline text={x} style={{marginBottom: 8}} />)}
          </Property>}
          {specimen?.catalogItem?.associatedReferences && <Property label="Associated references">
            {specimen?.catalogItem?.associatedReferences.split('|').map(x => <HyperText key={x} inline text={x} style={{marginBottom: 8}} />)}
          </Property>}
        </Properties>
      </div>
    </div>
    {/* <GeneralInfo id={specimen?.catalogItem?.materialEntityId} type="ORGANISM" />
    <GeneralInfo id={specimen?.catalogItem?.materialEntityId} type="MATERIAL" /> */}
  </Card>
};
