/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React, { useContext } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';

const TextButton = React.forwardRef(({
  ...props
}, ref) => {
  const theme = useContext(ThemeContext);
  return <button {...props} css={css`
    border: none;
    background: none;
    outline: none;
    font-size: inherit;
    color: inherit;
    font-weight: inherit;
    cursor: pointer;
    &:focus {
      outline: none;
      box-shadow: 0 0 0 0.125em rgba(50, 115, 220, 0.25);
    }
  `} ref={ref} />
});

TextButton.displayName = 'TextButton'

export default TextButton;