/** @jsx jsx */
import { jsx } from '@emotion/core';
import ThemeContext from '../../../../style/themes/ThemeContext';
import React, { useContext, useState } from 'react';
import intersection from 'lodash/intersection';
import PropTypes from 'prop-types';
import { Accordion, Properties, GalleryTiles, GalleryTile } from '../../../../components';
import { Classification } from "../Classification/Classification"
const { Term: T, Value: V } = Properties;
import { FormattedMessage, FormattedDate } from 'react-intl';
// import * as css from './styles';

export function Summary({ occurrence, fieldGroups, loading, setActiveImage, ...props }) {
  const theme = useContext(ThemeContext);

  if (!occurrence && !loading) return null;
  if (loading || !fieldGroups) return <span>Skeleton loader</span>

  return <Accordion summary='Summary' defaultOpen={true}>
    <Properties style={{ fontSize: 13, marginBottom: 12 }} horizontal={true}>
      {occurrence.stillImages?.length > 0 && <>
        <T>Images</T>
        <V>
          <GalleryTiles>
            {occurrence.stillImages.map((x, i) => {
              return <GalleryTile key={i} src={x.identifier} height={120} onClick={() => setActiveImage(x)}>
              </GalleryTile>
            })
            }
            <div></div>
          </GalleryTiles>
        </V>
      </>
      }
      <FieldPair term={fieldGroups.Taxon?.scientificName} occurrence={occurrence} fieldGroups={fieldGroups}
        formattedValue={<span dangerouslySetInnerHTML={{ __html: occurrence.gbifClassification.usage.formattedName }}></span>} />
      {occurrence.gbifClassification.synonym && <FieldPair term={fieldGroups.Taxon?.acceptedScientificName} occurrence={occurrence} fieldGroups={fieldGroups}
        formattedValue={<span dangerouslySetInnerHTML={{ __html: occurrence.gbifClassification.acceptedUsage.formattedName }}></span>} />}
      <T>Classification</T>
      <V><Classification taxon={occurrence.groups.Taxon} /></V>
      <FieldPair term={fieldGroups?.Taxon?.taxonRank} occurrence={occurrence} fieldGroups={fieldGroups} />

      <FieldPair term={fieldGroups?.Event?.eventDate} occurrence={occurrence} fieldGroups={fieldGroups} formattedValue={<FormattedDate value={fieldGroups?.Event?.eventDate?.value}
        year="numeric"
        month="long"
        day="2-digit" />} />

      <T>Basis of record</T>
      <V><Term occurrence={occurrence} term={fieldGroups?.Record?.basisOfRecord} formattedValue={<FormattedMessage id={`enums.basisOfRecord.${occurrence.basisOfRecord}`} />} /></V>
    </Properties>
  </Accordion>
}

function Term({ term, occurrence, formattedValue }) {
  if (!term) {
    return <span>No value</span>
  }
  else if (!term.issues) {
    return <Value term={term} formattedValue={formattedValue} />
  } else {
    return <Properties>
      <T>Interpreted</T>
      <V>
        <Value term={term} formattedValue={formattedValue} />
        {/* <span dangerouslySetInnerHTML={{ __html: occurrence.gbifClassification.usage.formattedName }}></span> */}
        {term.issues.map(x => <span key={x.id} style={{ background: '#ffee90', borderRadius: 20, fontSize: '10px', display: 'inline-block', padding: '0 8px' }}>{x.id}</span>)}
      </V>
      <T>Original</T>
      <V>{term.verbatim}</V>
    </Properties>
  }
}

function FieldPair({ term, occurrence, fieldGroups, formattedValue }) {
  if (!term) {
    return null;
  }
  else
    return <React.Fragment key={term.label}>
      <T>
        <FormattedMessage
          id={`ocurrenceFieldNames.${term.label}`}
          defaultMessage={_.startCase(term.label)}
        />
      </T>
      <V>
        <Term occurrence={occurrence} term={term} formattedValue={formattedValue} />
      </V>
    </React.Fragment>
}

function Value({ term, formattedValue }) {
  if (!formattedValue) {
    return <>{term.value}</>;
  } else {
    return formattedValue;
  }
}
