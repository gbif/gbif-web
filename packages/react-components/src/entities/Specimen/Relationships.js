import { jsx, css } from '@emotion/react';
import React, { useState } from 'react';
import { Classification, Properties, Button, Switch } from '../../components';
import { Term, Value } from '../../components/Properties/Properties';
import { Card, CardHeader2 } from '../shared';
import { ImBook as ReferenceIcon } from 'react-icons/im'
import { MdEdit } from 'react-icons/md';
import { prettifyString } from '../../utils/labelMaker/config2labels';
import { FormattedDate } from '../shared/header';
import { FormattedMessage } from 'react-intl';

export function Relationships({
  specimen,
  ...props
}) {
  if (!specimen) return null;

  return <Card padded={false} {...props}>
    <div css={css`padding: 12px 24px;`}>
      <CardHeader2>Relationships</CardHeader2>
    </div>
    <div css={css`padding: 12px 24px; background: var(--paperBackground800); border-top: 1px solid var(--paperBorderColor);`}>
      <h3 css={css`color: var(--color400); font-weight: normal; font-size: 16px;`}>Parts</h3>
      <ul css={css`margin: 0; padding: 0; list-style: none;`}>

        <li css={css`display: flex; margin-bottom: 12px;`}>
          <Card padded={false} css={css`padding: 12px;`}>
            {/* <Identification identification={identification} /> */}
            <div css={PropTable}>
              <div css={KeyValue}>
                <div>Preparation</div>
                <div>Heart</div>
              </div>
              <div css={KeyValue}>
                <div>Disposition</div>
                <div>Disposed</div>
              </div>
              <div css={KeyValue}>
                <div>Preparation</div>
                <div>Heart</div>
              </div>
              <div css={KeyValue}>
                <div>Disposition</div>
                <div>Disposed</div>
              </div>
              <div css={KeyValue}>
                <div>Description</div>
                <div css={PropTable}>
                  <div css={KeyValue}>
                    <div>Preparation</div>
                    <div>Heart</div>
                  </div>
                  <div css={KeyValue}>
                    <div>Disposition</div>
                    <div>Disposed</div>
                  </div>
                  <div css={KeyValue}>
                    <div>Preparation</div>
                    <div>Heart</div>
                  </div>
                  <div css={KeyValue}>
                    <div>Description</div>
                    <div>relationType, preparations, disposition, date (Before or afte)</div>
                  </div>
                  <div css={KeyValue}>
                    <div>Type</div>
                    <div>ITS</div>
                  </div>
                  <div css={KeyValue}>
                    <div>Sequence</div>
                    <div>AGGAAGTAAAAGTCGTAACAAGGTTTCCGTAGGTGAACCTGCGGAAGGATCATTATTGAAATTAAACTTGATAAGTTGTTGCTGGTTCTCTAGGGAGCATGTGCACACTTGTCATCTTTGTATTTCCACCTGTGCACTTTTTGTAGGCCTGATTATCTCTCTGAATGCTTAGCCATTCAGGATTGAGGATTGACTTTCAGTCTCTTCCTTACATTTTCGGGTCTATGTTCATTCATATACCCTATGTATGTTTATAGAATGTTGCTAATGGGCCTTTGTGCCTACAAATCTATACAACTTTCAGCAACGGATCTCTTGGCTCTCGCATCGATGAAGAACGCAGCGAAATGCGATAAGTAATGTGAATTGCAGAATTCAGTGAATCATCGAATCTTTGAACGCACCTTGCGCTCCTTGGTATTCCGAGGAGCATGCCTGTTTGAGTGTCATTAATATATCAACCTCTTTGGTTGGATGTGGGTTTGCTGGCCTCTTAAGGTCAGCTCCCCTTAAATGCATTAGCGGACAACATTTTGCCAACCGTTCATTAGTGTGATAATTATCTACGCTATTGACGTGAAGCATGGTTCAGCTTCTAACAGTCCATTGACTTGGACAAATTTCTTATTAATGTGACCTCAAATCAG</div>
                  </div>
                </div>
              </div>
            </div>
            <h3 css={css`color: var(--color400); font-weight: normal; font-size: 16px;`}>Assertions</h3>
            <div css={PropTable}>
              <div css={KeyValue}>
                <div>Scientific name</div>
                <div>Cortinarius koldingensis Frøslev & T.S.Jeppesen</div>
              </div>
              <div css={KeyValue}>
                <div>Identified by</div>
                <div>Tobias Frøslev, Thomas Stjernegaard Jeppesen</div>
              </div>
              <div css={KeyValue}>
                <div>Nature of ID</div>
                <div>Visual and dna</div>
              </div>
              <div css={KeyValue}>
                <div>Classification</div>
                <div>FungiBasidi omycotaAgar icomycetes AgaricalesC ortinariaceaeC ortinariusCortinarius koldingensis</div>
              </div>
              <div css={KeyValue}>
                <div>Type</div>
                <div>ITS</div>
              </div>
              <div css={KeyValue}>
                <div>Sequence</div>
                <div>AGGAAGTAAAAGTCGTAACAAGGTTTCCGTAGGTGAACCTGCGGAAGGATCATTATTGAAATTAAACTTGATAAGTTGTTGCTGGTTCTCTAGGGAGCATGTGCACACTTGTCATCTTTGTATTTCCACCTGTGCACTTTTTGTAGGCCTGATTATCTCTCTGAATGCTTAGCCATTCAGGATTGAGGATTGACTTTCAGTCTCTTCCTTACATTTTCGGGTCTATGTTCATTCATATACCCTATGTATGTTTATAGAATGTTGCTAATGGGCCTTTGTGCCTACAAATCTATACAACTTTCAGCAACGGATCTCTTGGCTCTCGCATCGATGAAGAACGCAGCGAAATGCGATAAGTAATGTGAATTGCAGAATTCAGTGAATCATCGAATCTTTGAACGCACCTTGCGCTCCTTGGTATTCCGAGGAGCATGCCTGTTTGAGTGTCATTAATATATCAACCTCTTTGGTTGGATGTGGGTTTGCTGGCCTCTTAAGGTCAGCTCCCCTTAAATGCATTAGCGGACAACATTTTGCCAACCGTTCATTAGTGTGATAATTATCTACGCTATTGACGTGAAGCATGGTTCAGCTTCTAACAGTCCATTGACTTGGACAAATTTCTTATTAATGTGACCTCAAATCAG</div>
              </div>
            </div>
          </Card>
        </li>

      </ul>
    </div>

  </Card>
};

function Relationship({ identification, ...props }) {
  return <Properties dense>
    <Term>Scientific name</Term>
    <div>
      <Value>
        <div>{identification.taxa[0].scientificName}</div>
      </Value>
    </div>

    {identification.identifiedBy && <>
      <Term>Identified by</Term>
      <Value>{identification.identifiedBy.join(', ')}</Value>
    </>}

    <Term>Nature of ID</Term>
    <Value>{prettifyString(identification.identificationType)}</Value>

    {identification.taxa[0].genus && <><Term>Classification</Term>
      <Value>
        <Classification>
          {['kingdom', 'phylum', 'class', 'order', 'family', 'genus'].map(rank => {
            const rankName = identification.taxa[0]?.[rank];
            if (!rankName) return null;
            return <span key={rank}>{rankName}</span>
          })}
        </Classification>
      </Value>
    </>}
  </Properties>
}

const PropTable = css`
  display: flex;
  flex-wrap: wrap;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  > div {
    flex: 1 1 auto;
  }
`;

const KeyValue = css`
  display: inline-block;
  border: 1px solid #f0f0f0;
  border-radius: 3px;
  display: inline-flex;
  margin: -1px;
  > div {
    flex: 0 0 auto;
    padding: 16px 24px;
    min-width: 33%;
  }
  >div:first-of-type {
    background: #fafafa;
    border-right: 1px solid #f0f0f0;
    min-width: 150px;
  }
  >div:last-of-type {
    background: white;
    flex: 1 1 auto;
    line-break: anywhere;
  }
`;