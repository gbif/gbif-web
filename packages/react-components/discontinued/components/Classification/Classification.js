
import { jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { getClasses } from '../../utils/util';
import { classification as style } from './styles';

export function Classification({
  as: Div = 'div',
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const { classNames } = getClasses(theme.prefix, 'classification', {/*modifiers goes here*/}, className);
  return <Div className={classNames} css={style({theme})} {...props} />
};

Classification.propTypes = {
  as: PropTypes.element
};
