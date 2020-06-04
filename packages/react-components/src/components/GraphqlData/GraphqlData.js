/** @jsx jsx */
import { jsx } from '@emotion/core';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { getClasses } from '../../utils/util';
import styles from './styles';

export function GraphqlData({
  as: Div = 'div',
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const { classNames } = getClasses(theme.prefix, 'graphqlData', {/*modifiers goes here*/}, className);
  return <Div css={styles.graphqlData({theme})} {...props} />
};

GraphqlData.propTypes = {
  as: PropTypes.element
};
