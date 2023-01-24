import { jsx, css } from '@emotion/react';
import React from 'react';
import { Classification, HyperText, Properties } from '../../components';
import { Term as T, Value as V } from '../../components/Properties/Properties';
import { Card, CardHeader2 } from '../shared';
import { ImBook as ReferenceIcon } from 'react-icons/im'
import { MdEdit } from 'react-icons/md';
import { TbCircleDot } from 'react-icons/tb';
import { prettifyString } from '../../utils/labelMaker/config2labels';

export function Material({
  specimen,
  ...props
}) {
  if (!specimen) return null;
  return <Card padded={false} {...props}>
    <div css={css`padding: 12px 24px;`}>
      <CardHeader2>Catalog item</CardHeader2>
      <div css={css``}>

      </div>
      <div css={css`margin-top: 12px;`}>
        <Properties dense>
          {['associatedSequences',
            'preparations',
            'catalogNumber',
            'otherCatalogNumbers',
            'recordedBy',
            'recordedById',
            'disposition',
            'recordNumber',
            'associatedReferences',
            'institutionCode',
            'collectionCode',
            'ownerInstitutionCode',]
            .filter(x => !!specimen.catalogItem[x]).map(x => <React.Fragment key={x}>
              <T>
                {prettifyString(x)}
              </T>
              <V>
                <HyperText text={specimen.catalogItem[x]} inline />
              </V>
            </React.Fragment>)}
        </Properties>
      </div>
    </div>
  </Card>
};
