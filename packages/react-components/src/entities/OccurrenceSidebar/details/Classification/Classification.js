/** @jsx jsx */
import { jsx } from '@emotion/core';
import ThemeContext from '../../../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import * as css from './styles';

export function Classification({
  as: Div = 'div',
  taxon,
  rank,
  showUnknownRanks,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const taxonMap = taxon.reduce((acc, cur) => {
    acc[cur.label]= cur;
    return acc
  }, {})
  const ranks = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'];
  const taxonRank = (rank || taxonMap.taxonRank?.value || taxonMap.taxonRank?.verbatim).toUpperCase();
  return <span css={css.majorRanks({ theme })} {...props}>
    {ranks.map(rank => {
      if (taxonRank !== rank.toUpperCase()) {
        if (taxonMap[rank]?.value) return <span key={rank}>{taxonMap[rank].value}</span>;
      if (showUnknownRanks) return <span key={rank} className="gbif-unknownRank">Unknown {rank}</span>
      }
      return null;
    })}
  </span>
};

Classification.propTypes = {
  as: PropTypes.element
};