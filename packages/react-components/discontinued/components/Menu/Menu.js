
import { css, jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import {
  useMenuState,
  Menu as BaseMenu,
  MenuItem,
  MenuButton
} from "reakit/Menu";
import { Portal } from "reakit/Portal";
import { Root } from '../Root/Root';
import Switch from '../Switch/Switch';

export const Menu = React.memo(({ trigger, placement, items, style, ...props }) => {
  const theme = useContext(ThemeContext);
  const menu = useMenuState({ placement: placement || theme.dir === 'rtl' ? 'bottom-start' : 'bottom-end' });
  return (
    <>
      <MenuButton {...menu} {...trigger.props}>
        {disclosureProps => React.cloneElement(trigger, disclosureProps)}
      </MenuButton>
      <Portal>
        <BaseMenu {...menu} {...props} css={focus(theme)} style={{ zIndex: 999 }}>
          <Root>
            <div css={menuContainer({ theme })} className="gb-menuContainer">
              {(typeof items === 'function' ? items(menu) : items).map((item, i) => (
                <MenuItem {...menu} {...item.props} key={i}>
                  {itemProps => React.cloneElement(item, itemProps)}
                </MenuItem>
              ))}
            </div>
          </Root>
        </BaseMenu>
      </Portal>
    </>
  );
});

export const MenuToggle = React.forwardRef(({
  children,
  onChange,
  className,
  style,
  ...props
}, ref) => {
  const theme = useContext(ThemeContext);
  return (
    <label className={className} css={menuOption(theme)} ref={ref} style={style}>
      <div>{children}</div>
      <div><Switch className="gb-menuOption-inner-switch" onChange={onChange ? onChange : null} {...props} /></div>
    </label>
  )
});

export const MenuAction = React.forwardRef(({
  children,
  ...props
}, ref) => {
  const theme = useContext(ThemeContext);
  return (
    <button ref={ref} css={menuAction(theme)} {...props}>
      <span>{children}</span>
    </button>
  )
});

const focus = theme => css`
  &:focus {
    outline: none;
    box-shadow: 0 0 0 0.125em #00000005;
  }
`;

export const menuOption = theme => css`
  padding: 8px 8px;
  display: block;
  display: flex;
  width: 100%;
  justify-content: space-between;
  overflow: hidden;
  font-size: 13px;
  &>* {
    margin: 0 8px;
  }
  &:focus, :focus-within {
    outline: none;
    background: ${theme.darkTheme ? '#00000050' : '#00000010'};
  }
`;

const menuAction = theme => css`
  ${menuOption(theme)};
  background: none;
  border: none;
  background: none;
  outline: none;
  color: ${theme.color900};
`;

const menuContainer = ({ theme }) => css`
  min-width: 180px;
  max-width: 100%;
  background-color: ${theme.paperBackground100};
  z-index: 999;
  outline: 0px;
  border: 1px solid rgba(33, 33, 33, 0.15);
  box-shadow: 3px 3px 2px rgba(0, 0, 0, 0.05);
`;