
import { jsx } from '@emotion/react';
import ThemeContext from '../../../../style/themes/ThemeContext';
import React, { useContext, useState } from 'react';
import intersection from 'lodash/intersection';
import PropTypes from 'prop-types';
import { Accordion, Properties, GalleryTiles, GalleryTile } from '../../../../components';
import { TaxonClassification } from "../TaxonClassification/TaxonClassification"
const { Term: T, Value: V } = Properties;
import { FormattedMessage, FormattedDate } from 'react-intl';
import * as css from '../../styles';
import { prettifyEnum } from '../../../../utils/labelMaker/config2labels';
import LinksContext from '../../../../search/OccurrenceSearch/config/links/LinksContext';

export function Summary({ occurrence, fieldGroups, loading, setActiveImage, ...props }) {
  const links = useContext(LinksContext);

  if (!occurrence && !loading) return null;
  if (loading || !fieldGroups) return <span>Skeleton loader</span>

  return <Accordion summary='Summary' defaultOpen={true}>
    <Properties style={{ fontSize: 13, marginBottom: 12 }}>
      {occurrence.stillImages?.length > 0 && <>
        <T>Images</T>
        <V>
          <GalleryTiles>
            {occurrence.stillImages.map((x, i) => {
              return <GalleryTile key={i} src={x.identifier} height={120} onClick={() => setActiveImage(x)}>
              </GalleryTile>
            })
            }
          </GalleryTiles>
        </V>
      </>
      }
      <T>
        <FormattedMessage
          id={`occurrenceFieldNames.scientificName`}
          defaultMessage={"Scientific Name"}
        />
      </T>
      <V>
        {links.scientificName ? <a href={links.scientificName.href(occurrence)} dangerouslySetInnerHTML={{ __html: occurrence.gbifClassification.usage.formattedName }} /> :
          <span dangerouslySetInnerHTML={{ __html: occurrence.gbifClassification.usage.formattedName }} />}
        {fieldGroups?.Taxon?.scientificName?.issues?.length > 0 &&
          fieldGroups.Taxon.scientificName.issues.map((i) => (
            <span css={css.issuePill(i)} key={i}>
              <FormattedMessage
                id={`enums.occurrenceIssue.${i.id}`}
                defaultMessage={prettifyEnum(i.id)}
              />
            </span>
          ))}
        {fieldGroups?.Taxon?.scientificName?.issues?.length > 0 && <div css={css.termRemark()}>{fieldGroups?.Taxon?.scientificName?.verbatim}</div>}
      </V>
      {fieldGroups?.Taxon?.synonym?.value === true && fieldGroups?.Taxon?.acceptedScientificName?.value && <> <T>
        <FormattedMessage
          id={`occurrenceFieldNames.acceptedScientificName`}
          defaultMessage={"Accepted Scientific Name"}
        />
      </T>
        <V>
          {links.acceptedScientificName ? <a href={links.acceptedScientificName.href(occurrence)} dangerouslySetInnerHTML={{ __html: occurrence.gbifClassification.acceptedUsage.formattedName }} /> :
            <span dangerouslySetInnerHTML={{ __html: occurrence.gbifClassification.acceptedUsage.formattedName }} />}
        </V></>}
      <T>
        <FormattedMessage
          id={`occurrenceDetails.taxonomicClassification`}
          defaultMessage={"Classification"}
        />
      </T>
      <V>
        <TaxonClassification ranks={occurrence.gbifClassification.classification} />
      </V>

      <FieldPair term={fieldGroups?.Event?.eventDate} occurrence={occurrence} fieldGroups={fieldGroups} formattedValue={<FormattedDate value={fieldGroups?.Event?.eventDate?.value}
        year="numeric"
        month="long"
        day="2-digit" />} />

      <T><FormattedMessage
        id={`occurrenceFieldNames.dataset`}
        defaultMessage={"Dataset"}
      /></T>
      <V>
        {links.dataset ? <a href={links.dataset.href(occurrence)} >{occurrence.datasetTitle} </a> : occurrence.datasetTitle}
      </V>

      <T>Basis of record</T>
      <V><Term occurrence={occurrence} term={fieldGroups?.Record?.basisOfRecord} formattedValue={<FormattedMessage id={`enums.basisOfRecord.${fieldGroups.Record.basisOfRecord.value}`} />} /></V>
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
        {term.issues.map(x => <span key={x.id} css={css.issuePill(x)}>{x.id}</span>)}
      </V>
      <T>Original</T>
      <V>{term.verbatim}</V>
    </Properties>
  }
}

function FieldPair({ term, occurrence, formattedValue }) {
  if (!term) {
    return null;
  }
  else
    return <React.Fragment key={term.label}>
      <T>
        <FormattedMessage
          id={`occurrenceFieldNames.${term.label}`}
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
