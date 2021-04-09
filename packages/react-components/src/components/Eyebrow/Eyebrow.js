import { jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { getClasses } from '../../utils/util';
import * as styles from './styles';

export function Eyebrow({
  as: Div = 'div',
  prefix,
  suffix,
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const { classNames } = getClasses(theme.prefix, 'eyebrow', {/*modifiers goes here*/}, className);
  return <Div css={styles.eyebrow({theme})} {...props}>
    <div>{prefix}</div>
    {suffix && <>
      <div css={styles.suffix}>
      {suffix}
      </div>
    </>}
  </Div>
};

Eyebrow.propTypes = {
  as: PropTypes.element
};
