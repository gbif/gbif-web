/** @jsx jsx */
import { jsx } from '@emotion/core';
import ThemeContext from '../../../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import { Classification } from '../../../../components';
import PropTypes from 'prop-types';
import * as css from './styles';

export function TaxonClassification({
  as: Div = 'div',
  ranks,
  ...props
}) {
  const theme = useContext(ThemeContext);
  return <Classification {...props}>
    {ranks.map(rank => <span key={rank.rank}>{rank.name}</span>)}
  </Classification>
};

Classification.propTypes = {
  as: PropTypes.element
};