import { jsx, css } from '@emotion/react';
import React, { useState } from 'react';
import { Classification, Properties, Button, Switch } from '../../components';
import { Property, Term, Value } from '../../components/Properties/Properties';
import { Card, CardHeader2 } from '../shared';
import { ImBook as ReferenceIcon } from 'react-icons/im'
import { MdEdit } from 'react-icons/md';
import { TbCircleDot } from 'react-icons/tb';
import { prettifyString } from '../../utils/labelMaker/config2labels';
import { FormattedDate } from '../shared/header';
import { FormattedMessage } from 'react-intl';
import * as styles from './styles';

export function Identifications({
  specimen,
  setSection,
  name = 'identifications',
  ...props
}) {
  const [showHistory, setHistoryState] = useState(false);
  if (!specimen?.identifications?.current) {
    setSection(name, false);
    return null;
  }
  setSection(name, true);

  const hasIdentificationHistory = specimen.identifications.history.length > 1;

  return <Card padded={false} {...props}>
    <div css={css`padding: 12px 24px;`}>
      <CardHeader2>Identification</CardHeader2>
      <div css={css`margin-top: 12px;`}>
        <Identification2 dense identification={specimen.identifications.current} />
        {/* <Properties dense>
          <Term>Scientific name</Term>
          <div>
            <Value>
              <div>{specimen?.identifications?.current?.taxa?.[0]?.scientificName ?? <Unknown />}</div>
            </Value>
          </div>

          {specimen?.identifications?.current?.taxa?.[0]?.scientificName && <>
            <Term>Classification</Term>
            <div>
              <Value>
                <Classification>
                  {['kingdom', 'phylum', 'class', 'order', 'family', 'genus'].map(rank => {
                    const rankName = specimen?.identifications?.current?.taxa?.[0]?.[rank];
                    if (!rankName) return null;
                    return <span key={rank}>{rankName}</span>
                  })}
                </Classification>
                &nbsp;
              </Value>
            </div>
          </>}


          {specimen?.identifications?.current?.taxa?.[0]?.scientificName !== specimen.identifications.current?.taxa?.[0]?.gbif?.usage?.name &&
            <>
              <Term>Scientific name (GBIF)</Term>
              <Value>
                {specimen.identifications.current.taxa[0].gbif.usage.name}
              </Value>
              <Term>Classification (GBIF)</Term>
              <Value>
                <Classification css={css`display: inline-block; margin-inline-end: 4px;`}>
                  {specimen.identifications.current.taxa[0].gbif.classification.map(rank => <span key={rank.key}>{rank.name}</span>)}
                </Classification>
              </Value>
            </>}

          {identifiedBy && <>
            <Term>Identified by</Term>
            <Value>{specimen.identifications.current.identifiedBy.join(', ')}</Value>
          </>}

          {specimen?.identifications?.current?.identificationRemarks && <>
            <Term>Remarks</Term>
            <Value>{specimen.identifications.current.identificationRemarks}</Value>
          </>}

          {specimen?.identifications?.current?.verbatimIdentification && <>
            <Term>Verbatim identification</Term>
            <Value>{specimen.identifications.current.verbatimIdentification}</Value>
          </>}



          {specimen?.identifications?.current?.identificationType && <><Term>Nature of ID</Term>
            <Value>{specimen.identifications.current.identificationType}</Value>
          </>}
          {specimen.identifications.current.dateIdentified && <>
            <Term>Date</Term>
            <Value>
              <FormattedDate value={specimen.identifications.current.dateIdentified}
                year="numeric"
                month="long"
                day="2-digit" />
            </Value>
          </>}
        </Properties> */}
      </div>
    </div>
    {hasIdentificationHistory && showHistory && <div css={css`padding: 12px 24px; background: var(--paperBackground800); border-top: 1px solid var(--paperBorderColor);`}>
      <h3 css={css`color: var(--color400); font-weight: normal; font-size: 16px;`}>Identifications history</h3>
      <ul css={css`margin: 0; padding: 0; list-style: none;`}>

        {specimen.identifications.history.map(identification => {
          return <li key={identification.identificationId} css={css`display: flex; margin-bottom: 12px;`}>
            <div css={css`flex: 0 0 150px; margin-inline-end: 24px; color: var(--color400); margin-top: 18px;`}>
              <FormattedDate value={identification.dateIdentified}
                year="numeric"
                month="long"
                day="2-digit" />
            </div>
            <div css={css`flex: 1 1 auto;`}>
              <Card padded={false} css={css`padding: 12px;`}>
                <Identification2 identification={identification} dense horizontal={false} />
              </Card>
            </div>
          </li>
        })}
      </ul>
    </div>}

    {hasIdentificationHistory && <div css={styles.cardFooter}>
      <label>
        <Switch checked={showHistory} onChange={() => setHistoryState(!showHistory)} style={{ marginInlineEnd: 8 }} />
        <FormattedMessage id="material.showHistory" defaultMessage="Show history" />
      </label>
    </div>}

  </Card>
};

function Identification({ identification, ...props }) {
  return <Properties dense horizontal={false}>
    <Property label="Scientific name">
      {identification?.taxa?.[0]?.scientificName ?? <Unknown />}
    </Property>

    {identification.identifiedBy && <Property label="Identified by">
      {identification.identifiedBy.join(', ')}
    </Property>}

    <Property label="Nature of ID" value={identification.identificationType} />

    {identification?.taxa?.[0]?.genus && <Property label="Classification">
      <Classification>
        {['kingdom', 'phylum', 'class', 'order', 'family', 'genus'].map(rank => {
          const rankName = identification?.taxa[0]?.[rank];
          if (!rankName) return null;
          return <span key={rank}>{rankName}</span>
        })}
      </Classification>
    </Property>}
  </Properties>
}

function Unknown() {
  return <span style={{ color: '#aaa' }}>Not provided</span>
}

function Identification2({ identification, ...props }) {
  if (!identification) return <div>Empty identification</div>;
  const identifiedBy = identification.identifiedBy;

  return <Properties {...props}>
    <Term>Scientific name</Term>
    <div>
      <Value>
        <div>{identification.taxa?.[0]?.scientificName ?? <Unknown />}</div>
      </Value>
    </div>

    {identification.taxa?.[0]?.scientificName && <>
      <Term>Classification</Term>
      <div>
        <Value>
          <Classification>
            {['kingdom', 'phylum', 'class', 'order', 'family', 'genus'].map(rank => {
              const rankName = identification.taxa?.[0]?.[rank];
              if (!rankName) return null;
              return <span key={rank}>{rankName}</span>
            })}
          </Classification>
          &nbsp;
        </Value>
      </div>
    </>}


    {identification.taxa?.[0]?.scientificName !== identification.taxa?.[0]?.gbif?.usage?.name &&
      <>
        <Term>Scientific name (GBIF)</Term>
        <Value>
          {identification.taxa[0].gbif?.usage?.name ?? 'Unknown'}
        </Value>
        {identification.taxa[0].gbif?.usage?.name && <>
          <Term>Classification (GBIF)</Term>
          <Value>
            <Classification css={css`display: inline-block; margin-inline-end: 4px;`}>
              {identification.taxa[0].gbif.classification.map(rank => <span key={rank.key}>{rank.name}</span>)}
            </Classification>
          </Value>
        </>}
      </>}

    {identifiedBy && <>
      <Term>Identified by</Term>
      <Value>{identification.identifiedBy.join(', ')}</Value>
    </>}

    {identification.identificationRemarks && <>
      <Term>Remarks</Term>
      <Value>{identification.identificationRemarks}</Value>
    </>}

    {identification.verbatimIdentification && <>
      <Term>Verbatim identification</Term>
      <Value>{identification.verbatimIdentification}</Value>
    </>}



    {identification.identificationType && <><Term>Nature of ID</Term>
      <Value>{identification.identificationType}</Value>
    </>}
    {identification.dateIdentified && <>
      <Term>Date</Term>
      <Value>
        <FormattedDate value={identification.dateIdentified}
          year="numeric"
          month="long"
          day="2-digit" />
      </Value>
    </>}
  </Properties>
}