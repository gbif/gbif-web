
import { jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { getClasses } from '../../utils/util';
import * as styles from './styles';

export function Tags({
  as: Div = 'div',
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const { classNames } = getClasses(theme.prefix, 'tags', {/*modifiers goes here*/}, className);
  return <Div css={styles.tags({theme})} {...classNames} {...props} />
}
export function Tag({
  as: Span = 'span',
  type = 'light',
  outline= false,
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const { classNames } = getClasses(theme.prefix, 'tag', {type, outline}, className);
  return <Span css={styles.tag({theme, type, outline})} {...classNames} {...props} />
};

Tag.propTypes = {
  as: PropTypes.element
};
