// For now we use Reakit as the functional components that handles focus and aria attributes, but https://reacttraining.com/reach-ui/ could also be an option. 
// Reakit seems nicer, but is in Beta and have poor support for RTL. Reach on the other hand seem to skimp on ARIA despite it being their primary focus. At least the implementations are not clearly inline with recommendations. But in general A11y seems an area with little true/false but mostly just opinions. Surprisingly so.


import { css, jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import {
  usePopoverState,
  Popover as BasePopover,
  PopoverDisclosure,
  PopoverArrow,
  PopoverBackdrop
} from "reakit/Popover";
import { Root } from '../Root/Root';

const Popover = ({ trigger, placement, visible, modal, onClickOutside, children, ...props }) => {
  const theme = useContext(ThemeContext);
  const popover = usePopoverState({
    modal: modal || false, 
    unstable_preventOverflow: true,
    // placement: placement || "bottom-start", 
    placement: 'auto', // annoyingly, only auto will prevent vertical overflow and there is no option to set alt-axis in reakit. See issue https://github.com/reakit/reakit/issues/606
    visible: visible,
    altAxis: true,
    altBoundary: true
  });
  const ref = React.useRef();

  React.useEffect(() => {
    if (popover.visible) {
      if (ref && ref.current) {
        ref.current.focus();
      }
    } 
  }, [popover.visible]);

  return (
    <>
      <PopoverDisclosure {...popover} {...trigger.props}>
        {disclosureProps => React.cloneElement(trigger, disclosureProps)}
      </PopoverDisclosure>
      <PopoverBackdrop {...popover} css={backdrop(theme)} onClick={() => onClickOutside ? onClickOutside(popover) : undefined}></PopoverBackdrop>
      <BasePopover dir={theme.dir} {...popover} {...props} hideOnClickOutside={false} hideOnEsc={true} preventBodyScroll={false}>
        {props => popover.visible &&
          <Root {...props} css={dialog(theme)}>
            <PopoverArrow className="arrow" {...popover} />
            <div css={dialogContent(theme)}>
              {typeof children === 'function' ? 
                children({hide: popover.hide, focusRef: ref }) : 
                React.cloneElement(children, {hide: popover.hide, focusRef: ref})}
            </div>
          </Root>
        }
      </BasePopover>
    </>
  );
};

Popover.propTypes = {
  trigger: PropTypes.object,
  placement: PropTypes.string,
  visible: PropTypes.bool,
  modal: PropTypes.bool,
  className: PropTypes.string,
  onClickOutside: PropTypes.func,
  children: PropTypes.any,
};

const backdrop = theme => css`
  background-color: ${theme.darkTheme ? '#0000006b' : '#00000040'};
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: 999;
`;

const dialogContent = theme => css`
  max-height: calc(100vh - 100px);
  /* overflow: auto; */
`;

const dialog = theme => css`
  background-color: ${theme.paperBackground500};
  /* position: fixed; */
  top: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  border-radius: ${theme.borderRadius}px;
  outline: 0px;
  border: 1px solid ${theme.paperBorderColor};
  /* box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 1000px 1000px; */
  &:focus {
    outline: none;
    /* box-shadow: 0 0 0 0.125em rgba(50, 115, 220, 0.25); */
  }
  & > .arrow {
    background-color: transparent;
    & .stroke {
      fill: ${theme.paperBorderColor};
    }
    & .fill {
      fill: ${theme.paperBackground500};
    }
  }
`;

export default Popover;