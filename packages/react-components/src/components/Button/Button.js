/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Button as ButtonA11y } from "reakit/Button";
import styles from './Button.styles';
import { getClasses } from '../../utils/util';
import { MdClose } from 'react-icons/md';

const truncateStyle = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
};

export const Button = React.forwardRef(({
  className = '',
  loading = false,
  block = false,
  isIcon = false,
  appearance = 'primary',
  children,
  truncate,
  ...props
}, ref) => {
  const classes = { appearance, loading, block };
  const theme = useContext(ThemeContext);
  // const appliedTheme = isEmpty(theme) ? standardTheme : theme;
  const appliedTheme = theme;
  const { classesToApply, humanClasses } = getClasses(appliedTheme, 'button', classes);
  return <ButtonA11y ref={ref} className={`${humanClasses} ${className}`} css={css`
        ${styles.button(appliedTheme)}
        ${classesToApply.map(x => styles[x](appliedTheme))};
`} {...props}>
    {truncate ? <span style={truncateStyle}>{children}</span> : children}
    {/* <span style={truncate ? truncateStyle : {}}>
      {children}
    </span> */}
  </ButtonA11y>
});

Button.displayName = 'Button'

Button.propTypes = {
  as: PropTypes.oneOf(['button', 'a', 'input']),
  className: PropTypes.string,
  appearance: PropTypes.oneOf(['primary', 'primaryOutline', 'outline', 'ghost', 'danger', 'link', 'text']),
  loading: PropTypes.bool,
  block: PropTypes.bool,
}

export const ButtonGroup = ({
  ...props
}) => {
  const theme = useContext(ThemeContext);
  return <div css={styles.group({ theme })} {...props} />
};

ButtonGroup.displayName = 'ButtonGroup'

export const FilterButton = React.forwardRef(({
  isActive,
  onClearRequest = () => { },
  onClick,
  loading,
  children,
  ...props
}, ref) => {
  if (!isActive) {
    return <ButtonGroup {...props}>
      <Button ref={ref} loading={loading} appearance="primaryOutline" onClick={onClick}>{children}</Button>
    </ButtonGroup>
  }
  return <ButtonGroup {...props}>
    <Button appearance="primary" ref={ref} onClick={onClick} loading={loading}>{children}</Button>
    <Button appearance="primary" onClick={onClearRequest}>
      <MdClose style={{ verticalAlign: 'middle' }} />
    </Button>
  </ButtonGroup>
});

FilterButton.propTypes = {
  isActive: PropTypes.bool,
  onClearRequest: PropTypes.func,
  onClick: PropTypes.func,
  children: PropTypes.any,
}