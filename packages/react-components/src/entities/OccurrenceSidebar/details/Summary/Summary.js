/** @jsx jsx */
import { jsx } from '@emotion/core';
import ThemeContext from '../../../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import intersection from 'lodash/intersection';
import PropTypes from 'prop-types';
import { Accordion, Properties, GalleryTiles, GalleryTile } from '../../../../components';
import { Classification } from "../Classification/Classification"
const { Term: T, Value: V } = Properties;

// import * as css from './styles';

export function Summary({ occurrence, loading, ...props }) {
  const theme = useContext(ThemeContext);
  if (!occurrence && !loading) return null;
  if (loading) return <span>Skeleton loader</span>

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
      <T>Scientific name</T><V>
        <ScientificName occurrence={occurrence} />
      </V>
      <T>Classification</T><V><Classification taxon={occurrence.groups.Taxon} /></V>
      <T>Rank</T><V>Species</V>
      <T>Taxonomic status	</T><V>Synonym for Xanthoria parietina (L.) Beltr.</V>
    </Properties>
  </Accordion>
}

function ScientificName({ occurrence }) {
  const taxonIssues = intersection(['TAXON_MATCH_FUZZY', 'TAXON_MATCH_HIGHERRANK', 'TAXON_MATCH_NONE'], occurrence.issues);
  console.log(taxonIssues);
  if (taxonIssues.length === 0) {
    return <span dangerouslySetInnerHTML={{ __html: occurrence.gbifClassification.usage.formattedName }}></span>
  } else {
    return <Properties>
      <T>Interpreted</T>
      <V>
        <span dangerouslySetInnerHTML={{ __html: occurrence.gbifClassification.usage.formattedName }}></span>
        {taxonIssues.map(x => <span style={{ background: '#ffee90', borderRadius: 20, fontSize: '10px', display: 'inline-block', padding: '0 8px' }}>{x}</span>)}
      </V>
      <T>Original</T>
      <V>{occurrence.groups.Taxon[1].verbatim}</V>
    </Properties>
  }
}
