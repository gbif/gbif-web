import { jsx, css } from '@emotion/react';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { ButtonGroup, Button, Image, ResourceLink, Accordion, Properties, GadmClassification, GalleryTiles, GalleryTile, DatasetKeyLink, PublisherKeyLink, HyperText } from "../../../components";
import { CustomValueField, BasicField, PlainTextField, EnumField, HtmlField, LicenseField, Chips } from './properties';
import { Group } from './Groups';
// import { SequenceVisual } from './SequenceVisual';
import * as styles from "../styles";
import { Card, CardHeader2 } from '../../shared';
import { prettifyString } from '../../../utils/labelMaker/config2labels';
const { Term: T, Value: V } = Properties;

export function Sequences({ specimen, updateToc, ...props }) {
  if (!specimen || specimen.sequences.material.length === 0 && specimen.sequences.parts.length === 0 && specimen?.sequences?.external.length === 0) return null;
  return <Card padded={false} {...props}>
    <div css={css`padding: 12px 24px;`}>
      <CardHeader2>Sequences</CardHeader2>

      <ul css={css`list-style: none; margin: 0; padding: 0;`}>
        {specimen.sequences.material.map(seq => <li key={seq.digitalEntityId}>
          <Sequence sequence={seq} />
        </li>)}
        {specimen.sequences.parts.map(({ material, sequences }) => {
          const seqHtml = sequences.map(x => <li key={x.digitalEntityId}>
            <Sequence sequence={x} material={material} />
          </li>);
          return seqHtml;
        })}
        {specimen.sequences.external.map(x => <li key={x.entityRelationshipId}>
          <Sequence sequence={x} />
        </li>)}
      </ul>
    </div>
  </Card>;
}

function Sequence({ sequence, material }) {
  return <div css={css`margin-top: 12px;`}>
    <Properties dense>
      {sequence.geneticSequenceByGeneticSequenceId && <>
        <T>
          Type
        </T>
        <V>
          {sequence.geneticSequenceByGeneticSequenceId.geneticSequenceType}
        </V>

        <T>
          Sequence
        </T>
        <V>
          {sequence.geneticSequenceByGeneticSequenceId.sequence.substr(0, 100)}... <Button look="outline" style={{ fontSize: 12 }} onClick={() => { navigator.clipboard.writeText(sequence.geneticSequenceByGeneticSequenceId.sequence) }}>Copy to clipboard</Button>
        </V>
      </>}
      {['objectEntityIri',
        'accessUri',
        'format',
        'webStatement',
        'license',
        'rights',
        'rightsUri',
        'accessRights',
        'rightsHolder',
        'source',
        'sourceUri',
        'creator',
        'created',
        'modified',
        'language',
        'bibliographicCitation']
        .filter(x => !!sequence[x]).map(x => <React.Fragment key={x}>
          <T>
            {prettifyString(x)}
          </T>
          <V>
            <HyperText text={sequence[x]} inline />
          </V>
        </React.Fragment>)}
    </Properties>
  </div>
}