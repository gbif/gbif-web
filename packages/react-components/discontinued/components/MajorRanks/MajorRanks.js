
import { jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import * as css from './styles';
import { Classification } from '../Classification/Classification';

export function MajorRanks({
  as: Div = 'div',
  taxon,
  rank,
  showUnknownRanks,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const ranks = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'];
  const taxonRank = (rank || taxon.rank).toUpperCase();
  return <Classification as="span" {...props}>
    {ranks.map(rank => {
      if (taxonRank !== rank.toUpperCase()) {
        if (taxon[rank]) return <span key={rank}>{taxon[rank]}</span>;
      if (showUnknownRanks) return <span key={rank} className="gbif-classification-unknown">Unknown {rank}</span>
      }
      return null;
    })}
  </Classification>
};

MajorRanks.propTypes = {
  as: PropTypes.element
};