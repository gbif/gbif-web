/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useContext, useState, useEffect } from 'react';
import get from 'lodash/get';
import { MdDone } from 'react-icons/md';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from '../styles';
import { Accordion, Properties, Row, Col, Image } from "../../../components";
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

  return <div style={{ padding: '0 16px' }}>
    <Row wrap="no-wrap">
      {/* <Col grow={false}>
        <Image src={data.occurrence.primaryImage.identifier} w="100" style={{ maxHeight: 150 }} />
      </Col> */}
      <Col grow>
        <h3 dangerouslySetInnerHTML={{ __html: data?.occurrence?.gbifClassification?.usage?.formattedName }}></h3>
        {/* <p>sdfkjh sdkfjh </p> */}
      </Col>
    </Row>
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