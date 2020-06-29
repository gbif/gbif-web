/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useContext, useCallback, useState, useEffect } from 'react';
import get from 'lodash/get';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from '../styles';
import { Accordion, Properties, Row, Col, GalleryTiles, GalleryTile } from "../../../components";
import { Globe } from './Globe';

const { Term, Value } = Properties;

export function Intro({
  data,
  loading,
  error,
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);

  if (loading || !data) return <h1>Loading</h1>;

  return <div style={{ padding: '12px 16px' }}>
    <Row wrap="no-wrap">
      <Col grow={false} style={{ marginRight: 18 }}>
        <Globe {...data?.occurrence?.volatile?.globe} />
      </Col>
      <Col grow>
        
        <div css={css.headline({ theme })}>
          <h3 dangerouslySetInnerHTML={{ __html: data?.occurrence?.gbifClassification?.usage?.formattedName }}></h3>
        </div>
        <div>sdflkjh jh</div>
        {/* <p>sdfkjh sdkfjh </p> */}
      </Col>
    </Row>
    {data?.occurrence?.multimediaItems?.length > 0 &&
      <Accordion css={css.accordion({theme})} summary={<span>Photos</span>} defaultOpen={true}>
        <GalleryTiles>
          {data.occurrence.multimediaItems.map((x, i) => {
            return <GalleryTile key={i} src={x.identifier} height={120}>
              </GalleryTile>
          })
          }
          <div></div>
        </GalleryTiles>
      </Accordion>
    }
    {[recordGroup, OccurrenceGroup].map((group, index) => {
      return <Accordion key={index} css={css.accordion({ theme })} summary="Record" defaultOpen={true}>
        <Properties style={{ fontSize: 13 }} horizontal={true}>
          {group
            .map(x => typeof x === 'string' ? { key: x, label: x } : x)
            .filter(x => data.occurrence[x.key] !== null)
            .map((x, i) => {
              return <React.Fragment key={x.key}>
                <Term>{x.label}</Term>
                <Value>
                  {getValue(x, data)}
                </Value>
              </React.Fragment>
            }
            )}
        </Properties>
      </Accordion>
    })}
  </div>
};

function getValue({ key, label }, data) {
  const value = get(data, `occurrence.${key}`);
  switch (label) {
    case 'scientificName':
      return <span dangerouslySetInnerHTML={{ __html: value }}></span>
    default:
      return '' + value;
  }
}

const recordGroup = [
  'datasetTitle',
  'institutionID',
  'collectionID',
  'datasetID',
  'institutionCode',
  'collectionCode',
  'datasetName',
  'ownerInstitutionCode',
  'basisOfRecord',
  'informationWithheld',
  'dataGeneralizations',
  'dynamicProperties',
  { label: 'scientificName', key: 'gbifClassification.usage.formattedName' },
];

const OccurrenceGroup = [
  "occurrenceId",
  "catalogNumber",
  "recordNumber",
  "individualCount",
  "organismQuantity",
  "organismQuantityType",
  "sex",
  "lifeStage",
  "reproductiveCondition",
  "behavior",
  "establishmentMeans",
  "occurrenceStatus",
  "preparations",
  "disposition",
  "associatedReferences",
  "associatedSequences",
  "associatedTaxa",
  "otherCatalogNumbers",
  "occurrenceRemarks",
  "issues",
  "hasCoordinate",
  "hasGeospatialIssue",
  "repatriated",
  "recordedByIds",
  "associatedMedia"
];