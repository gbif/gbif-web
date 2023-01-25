import { jsx, css } from '@emotion/react';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { ButtonGroup, Button, Image, ResourceLink, Accordion, Properties, GadmClassification, GalleryTiles, GalleryTile, DatasetKeyLink, PublisherKeyLink } from "../../../components";
import { CustomValueField, BasicField, PlainTextField, EnumField, HtmlField, LicenseField, Chips } from './properties';
import { Group } from './Groups';
// import { SequenceVisual } from './SequenceVisual';
import * as styles from "../styles";
import { Card, CardHeader2 } from '../../shared';
const { Term: T, Value: V } = Properties;

export function Sequences({ specimen, updateToc, ...props }) {
  const dnaDerivedSequence = specimen?.extensions?.['http://rs.gbif.org/terms/1.0/DNADerivedData']?.[0]?.['http://rs.gbif.org/terms/dna_sequence'];
  const amplificationSequence = specimen?.extensions?.['http://data.ggbn.org/schemas/ggbn/terms/Amplification']?.[0]?.['http://data.ggbn.org/schemas/ggbn/terms/consensusSequence'];
  const seq = dnaDerivedSequence || amplificationSequence;
  return <Card padded={false} {...props}>
    <div css={css`padding: 12px 24px;`}>
      <CardHeader2>Sequences</CardHeader2>
      {/* <SequenceVisual sequence={seq} /> */}
      <div css={css`margin-top: 12px;`}>
        <Properties dense css={styles.properties} breakpoint={800} >
          <T>Target gene</T>
          <V>{specimen?.extensions?.['http://rs.gbif.org/terms/1.0/DNADerivedData']?.[0]?.['https://w3id.org/gensc/terms/MIXS:0000044']}</V>

          <T>DNA sequence</T>
          <V>{specimen?.extensions?.['http://rs.gbif.org/terms/1.0/DNADerivedData']?.[0]?.['http://rs.gbif.org/terms/dna_sequence']}</V>
        </Properties>
      </div>
    </div>
  </Card>;
}