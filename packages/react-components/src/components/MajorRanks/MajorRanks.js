/** @jsx jsx */
import { jsx } from '@emotion/core';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import * as css from './styles';

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
  return <span css={css.majorRanks({ theme })} {...props}>
    {ranks.map(rank => {
      if (taxonRank !== rank.toUpperCase()) {
        if (taxon[rank]) return <span key={rank}>{taxon[rank]}</span>;
      if (showUnknownRanks) return <span key={rank} className="gbif-unknownRank">Unknown {rank}</span>
      }
      return null;
    })}
  </span>
};

MajorRanks.propTypes = {
  as: PropTypes.element
};