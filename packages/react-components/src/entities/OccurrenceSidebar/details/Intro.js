/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useContext, useCallback, useState, useEffect } from 'react';
import { FormattedMessage, FormattedDate } from 'react-intl';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import { MdLocationOn, MdPhotoLibrary, MdGpsFixed } from 'react-icons/md';
import { GiDna1 } from 'react-icons/gi';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from '../styles';
import { Accordion, Properties, Row, Col, GalleryTiles, GalleryTile, Switch } from "../../../components";
import { Globe } from './Globe';
import { Header } from './Header';

const { Term: T, Value: V } = Properties;

export function Intro({
  data = {},
  isSpecimen,
  loading,
  error,
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const [showAll, setShowAll] = useState(false);
  const [verbatim, setVerbatim] = useState(false);

  const { occurrence } = data;
  if (loading || !occurrence) return <h1>Loading</h1>;
  const accordionCss = css.accordion({ theme });

  return <Row direction="column">
    <Col style={{ padding: '12px 16px', paddingBottom: 50 }} grow>
      <Header data={data} error={error} />

      {occurrence.multimediaItems?.length > 0 &&
        <Accordion css={accordionCss} summary={<span>Photos</span>} defaultOpen={true}>
          <GalleryTiles>
            {occurrence.multimediaItems.map((x, i) => {
              return <GalleryTile key={i} src={x.identifier} height={120}>
              </GalleryTile>
            })
            }
            <div></div>
          </GalleryTiles>
        </Accordion>
      }
      {[recordGroup, OccurrenceGroup, EventGroup, IdentifiersGroup]
        .map((group, index) => getGroup({ group, occurrence, isSpecimen, showAll }))}
    </Col>
    <Col css={css.controlFooter({ theme })} grow={false}>
      <Row justifyContent="flex-end" halfGutter={8}>
        <Col grow={false}>
          Show all fields <Switch disabled={verbatim} checked={showAll} onChange={() => setShowAll(!showAll)} direction="top" tip="Shortcut s" />
        </Col>
        <Col grow={false} shrink>
          Diagnostics view <Switch checked={verbatim} onChange={() => setVerbatim(!verbatim)} direction="top" tip="Shortcut v" />
        </Col>
      </Row>
    </Col>
  </Row>
};

function getGroup({ group, occurrence, isSpecimen, showAll, theme }) {
  const stdFields = getFields({ fields: group.fields, occurrence, isSpecimen, showAll });
  const hiddenFields = !showAll ? [] : getFields({ fields: group.hiddenFields, occurrence, isSpecimen, showAll });

  const fields = [...stdFields, ...hiddenFields];

  if (fields.length === 0) return null;

  return <Accordion key={group.title} css={css.accordion({ theme })} summary={group.title} defaultOpen={group.defaultOpen}>
    <Properties style={{ fontSize: 13 }} horizontal={true}>
      {fields}
    </Properties>
  </Accordion>
}
function getFields({ fields = [], occurrence, isSpecimen, showAll }) {
  return fields
    .map(x => typeof x === 'string' ? { key: x, label: x } : x)
    .filter(x => !x.key || !isNil(occurrence[x.key]))
    .filter(x => showAll || !x.condition || x.condition({ isSpecimen, occurrence }))
    .map((x, i) => {
      return <React.Fragment key={x.key}>
        <T>{x.label}</T>
        <V>{getValue(x, occurrence)}</V>
      </React.Fragment>
    });
}
function getValue({ key, label, component: C }, occurrence) {
  const value = get(occurrence, key);
  if (C) {
    return <C occurrence={occurrence} />
  } else {
    return '' + value;
  }
}

const recordGroup = {
  title: 'Record',
  defaultOpen: true,
  fields: [
    'basisOfRecord',
    { label: 'institutionCode', key: 'institutionCode', condition: ({ isSpecimen }) => isSpecimen },
    { label: 'institutionID', key: 'institutionID', condition: ({ isSpecimen }) => isSpecimen },
    { label: 'collectionCode', key: 'collectionCode', condition: ({ isSpecimen }) => isSpecimen },
    { label: 'collectionID', key: 'collectionID', condition: ({ isSpecimen }) => isSpecimen },
    { label: 'ownerInstitutionCode', key: 'ownerInstitutionCode', condition: ({ isSpecimen }) => isSpecimen },
    'informationWithheld',
    'dataGeneralizations',
    'dynamicProperties',
    // { label: 'scientificName', key: 'gbifClassification.usage.formattedName', condition: ({ isSpecimen }) => isSpecimen },
    // {
    //   label: 'something custom',
    //   component: ({ occurrence }) =>
    //     <span dangerouslySetInnerHTML={{ __html: occurrence.gbifClassification.usage.formattedName }}></span>
    // }
  ],
  hiddenFields: [
    'datasetID',
    'datasetName'
  ]
};

const OccurrenceGroup = {
  title: 'Occurrence',
  defaultOpen: true,
  fields: [
    { label: 'catalogNumber', key: 'catalogNumber', condition: ({ isSpecimen }) => isSpecimen },
    { label: 'recordNumber', key: 'recordNumber', condition: ({ isSpecimen }) => isSpecimen },
    'individualCount',
    {
      label: 'Organism quantity',
      condition: ({ occurrence }) => occurrence.organismQuantity && occurrence.organismQuantityType,
      component: ({ occurrence }) =>
        <>{occurrence.organismQuantity} {occurrence.organismQuantityType}</>
    },
    'sex',
    'lifeStage',
    'reproductiveCondition',
    'behavior',
    'establishmentMeans',
    { label: 'occurrenceStatus', key: 'occurrenceStatus', condition: ({ occurrence }) => occurrence.occurrenceStatus !== 'present' },
    'preparations',
    'disposition',
    'associatedReferences',
    'associatedSequences',
    'associatedTaxa',
    'occurrenceRemarks',
    'recordedByIds',
    'associatedMedia'
  ],
  hiddenFields: [
    'occurrenceId',
    'otherCatalogNumbers'
  ]
};

const EventGroup = {
  title: 'Event',
  defaultOpen: true,
  fields: [
    'eventDate',
    'eventTime',
    { label: 'eventID', key: 'eventID', condition: ({ occurrence }) => occurrence.samplingProtocol },
    { label: 'parentEventID', key: 'parentEventID', condition: ({ occurrence }) => occurrence.samplingProtocol },
    'eventRemarks',
    'samplingProtocol',
    'samplingEffort',
    'sampleSizeValue',
    'sampleSizeUnit',
    'fieldNotes',
    'fieldNumber',
    'habitat',
  ],
  hiddenFields: [
    'startDayOfYear',
    'endDayOfYear',
    'year',
    'month',
    'day',
    'verbatimEventDate',
  ]
};

const LocationGroup = {
  title: 'Location',
  defaultOpen: true,
  fields: [
    'continent',
    'waterBody',
    'islandGroup',
    'island',
    'higherGeography',
    'stateProvince',
    'county',
    'municipality',
    'locality',
    'verbatimLocality',
  ],
  hiddenFields: [
    'locationID',
    'higherGeographyID',
    'countryCode',
  ]
};

const IdentifiersGroup = {
  title: 'Identifiers',
  defaultOpen: false,
  fields: [
    'gbifId',
    'occurrenceId'
  ]
};