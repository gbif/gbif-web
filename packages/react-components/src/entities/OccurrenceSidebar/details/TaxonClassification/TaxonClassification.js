
import { jsx } from '@emotion/react';
import ThemeContext from '../../../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import { Classification } from '../../../../components';
import PropTypes from 'prop-types';

export function TaxonClassification({
  as: Div = 'div',
  includeTerminal = false,
  ranks,
  ...props
}) {
  // const theme = useContext(ThemeContext);
  return <Classification {...props}>
    {ranks.map((rank, i, { length }) => {
      if (!includeTerminal && length - 1 === i) return null;
      return <span key={rank.rank}>{rank.name}</span>
    })}
  </Classification>
};

Classification.propTypes = {
  as: PropTypes.element
};