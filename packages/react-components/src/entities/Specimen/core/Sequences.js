import { jsx } from '@emotion/react';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { ButtonGroup, Button, Image, ResourceLink, Accordion, Properties, GadmClassification, GalleryTiles, GalleryTile, DatasetKeyLink, PublisherKeyLink } from "../../../components";
import { CustomValueField, BasicField, PlainTextField, EnumField, HtmlField, LicenseField, Chips } from './properties';
import { Group } from './Groups';
// import { SequenceVisual } from './SequenceVisual';
import * as css from "../styles";
const { Term: T, Value: V } = Properties;

export function Sequences({ specimen }) {
  const dnaDerivedSequence = specimen?.extensions?.['http://rs.gbif.org/terms/1.0/DNADerivedData']?.[0]?.['http://rs.gbif.org/terms/dna_sequence'];
  const amplificationSequence = specimen?.extensions?.['http://data.ggbn.org/schemas/ggbn/terms/Amplification']?.[0]?.['http://data.ggbn.org/schemas/ggbn/terms/consensusSequence'];
  const seq = dnaDerivedSequence || amplificationSequence;
  return <Group label="occurrenceDetails.groups.sequences" id="Sequences">
    {/* <SequenceVisual sequence={seq} /> */}
    <Properties css={css.properties} breakpoint={800} style={{ marginTop: 12 }}>
      <T>Target gene</T>
      <V>{specimen?.extensions?.['http://rs.gbif.org/terms/1.0/DNADerivedData']?.[0]?.['https://w3id.org/gensc/terms/MIXS:0000044']}</V>

      <T>DNA sequence</T>
      <V>{specimen?.extensions?.['http://rs.gbif.org/terms/1.0/DNADerivedData']?.[0]?.['http://rs.gbif.org/terms/dna_sequence']}</V>
    </Properties>
  </Group>;
}