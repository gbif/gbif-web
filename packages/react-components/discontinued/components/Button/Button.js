
import { css, jsx } from '@emotion/react';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Button as ButtonA11y } from "reakit/Button";
import * as styles from './Button.styles';
import { getClasses } from '../../utils/util';
import { MdMoreHoriz, MdClose } from 'react-icons/md';
import { Menu, MenuAction } from '../Menu/Menu';

const truncateStyle = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
};

export const Button = React.forwardRef(({
  className = '',
  loading = false,
  isFullWidth = false,
  isIcon = false,
  appearance,
  look = 'primary',
  children,
  truncate,
  as,
  ...props
}, ref) => {
  appearance = appearance || look;
  const Comp = as || ButtonA11y;
  const { classesToApply, classNames } = getClasses('gbif', 'button', { appearance, loading, isFullWidth }, className);
  return <Comp ref={ref} {...classNames} css={css`
        ${styles.button}
        ${classesToApply.map(x => styles[x])};
`} {...props}>
    {truncate ? <span style={truncateStyle}>{children}</span> : children}
    {/* <span style={truncate ? truncateStyle : {}}>
      {children}
    </span> */}
  </Comp>
});

Button.displayName = 'Button'

Button.propTypes = {
  as: PropTypes.oneOf(['button', 'a', 'input', 'span', 'div', 'label']),
  className: PropTypes.string,
  appearance: PropTypes.oneOf(['primary', 'primaryOutline', 'outline', 'ghost', 'danger', 'link', 'text']),
  loading: PropTypes.bool,
  block: PropTypes.bool,
}

export const ButtonGroup = ({
  ...props
}) => {
  return <div css={styles.group} {...props} />
};

ButtonGroup.displayName = 'ButtonGroup'

export const FilterButton = React.forwardRef(({
  isActive,
  onClearRequest = () => { },
  onClick,
  loading,
  children,
  title,
  truncate,
  isNegated = false,
  ...props
}, ref) => {
  if (!isActive) {
    return <ButtonGroup {...props}>
      <Button {...props} ref={ref} loading={loading} appearance="primaryOutline" onClick={onClick}>{children}</Button>
    </ButtonGroup>
  }
  return <ButtonGroup style={{ maxWidth: '100%' }}>
    {isNegated && <Button {...props} title="Negated filter" appearance="primary" onClick={onClick} loading={loading}><span>Exclude</span></Button>}
    <Button {...props} style={{ maxWidth: 400 }} title={title} truncate={truncate} appearance="primary" ref={ref} onClick={onClick} loading={loading}>{children}</Button>
    <Button appearance="primary" onClick={onClearRequest} style={{ flex: '0 0 auto' }}>
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

export const TextButton = React.forwardRef(({ look, ...props }, ref) => {
  return <ButtonA11y ref={ref} css={css`${styles.text} ${look ? styles[look] : null}`} {...props} />
});

export const DropdownButton = React.forwardRef(({
  isActive,
  onClick,
  loading,
  title,
  label,
  children,
  ariaLabel = "Menu",
  menuItems = () => [],
  look,
  style,
  truncate,
  ...props
}, ref) => {

  return <ButtonGroup style={style}>
    {children && <Button {...props} style={{ maxWidth: 400 }} truncate={truncate} look={look} ref={ref} onClick={onClick} loading={loading}>{children}</Button>}
    {menuItems.length > 0 && <Menu
      aria-label={ariaLabel}
      trigger={<Button look={look} style={{ flex: '0 0 auto' }}>
        {label} <MdMoreHoriz style={{ marginInlineStart: label ? '6px' : 0, verticalAlign: 'middle' }} />
      </Button>}
      items={menuItems}
    />}
  </ButtonGroup>
});

DropdownButton.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.any,
}

DropdownButton.MenuAction = MenuAction;