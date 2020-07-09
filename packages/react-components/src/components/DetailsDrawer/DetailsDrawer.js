/** @jsx jsx */
import { jsx } from '@emotion/core';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getClasses } from '../../utils/util';
import { Root, Button } from '../../components';
import * as css from './styles';
import { Dialog, DialogBackdrop } from "reakit/Dialog";
import { keyCodes } from '../../utils/util';
import { MdChevronRight, MdChevronLeft, MdClose } from "react-icons/md";

export function DetailsDrawer({ dialog, nextItem, previousItem, children, ...props }) {
  useEffect(() => {
    function handleKeypress(e) {
      switch (e.which) {
        case keyCodes.LEFT_ARROW: previousItem ? previousItem() : null; return;
        case keyCodes.RIGHT_ARROW: nextItem ? nextItem() : null; return;
        default: return;
      }
    }
    if (document) document.addEventListener("keydown", handleKeypress, false);

    return function cleanup() {
      if (document) document.removeEventListener("keydown", handleKeypress, false);
    }
  }, [nextItem, previousItem]);

  return (
    <>
      <DialogBackdrop {...dialog} css={css.detailsBackdrop()}>
        <Dialog {...dialog} aria-label="Details" css={css.drawer()}>
          {dialog.visible &&
            <Root style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
              
              <div style={{flex: '1 1 auto', overflow: 'auto'}}>
                {children}
              </div>
              {(previousItem || nextItem) && <div style={{display: 'flex', justifyContent: 'space-between', flex: '0 0 auto', background: 'white', borderTop: '1px solid #ddd', padding: '8px 12px'}}>
                {previousItem && <Button css={css.footerItem()} appearance="text" direction="right" tip="previous (left arrow)" onClick={previousItem}>
                  <MdChevronLeft />
                </Button>}
                {nextItem && <Button css={css.footerItem()} appearance="text" direction="left" tip="next (right arrow)" onClick={nextItem}>
                  <MdChevronRight />
                </Button>}
              </div>}
            </Root>
          }
        </Dialog>
      </DialogBackdrop>
    </>
  );
}

export function DetailsDrawer2({
  as: Div = 'div',
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const { classNames } = getClasses(theme.prefix, 'detailsDrawer', {/*modifiers goes here*/ }, className);
  return <Div css={styles.detailsDrawer({ theme })} {...props} />
};

DetailsDrawer.propTypes = {
  as: PropTypes.element
};
