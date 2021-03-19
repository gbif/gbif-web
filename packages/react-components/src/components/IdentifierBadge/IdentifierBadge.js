/** @jsxImportSource @emotion/core */
import { jsx } from '@emotion/core';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { getClasses } from '../../utils/util';
import * as styles from './styles';

export const IdentifierBadge = React.forwardRef(({
  as: Div = 'div',
  className,
  ...props
}, ref) => {
  const theme = useContext(ThemeContext);
  const { classNames } = getClasses(theme.prefix, 'identifierBadge', {/*modifiers goes here*/}, className);
  return <Div ref={ref} {...classNames} css={styles.identifierBadge({theme})} {...props}>
    <span>VIAF</span>
    <span>12345678</span>
  </Div>
});

IdentifierBadge.propTypes = {
  as: PropTypes.element
};
