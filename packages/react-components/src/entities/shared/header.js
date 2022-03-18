
import { jsx } from '@emotion/react';
import React, { useContext, useCallback, useState, useEffect } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import { Prose } from '../../components';
import useBelow from '../../utils/useBelow';
import * as css from './styles';

const { H1 } = Prose;

export function Headline(props) {
  const theme = useContext(ThemeContext);
  return <H1 css={css.headline({theme})} {...props} />
}