
import { jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Root, Button } from '../../components';
import * as css from './styles';
import { Dialog, DialogBackdrop } from "reakit/Dialog";
import { keyCodes } from '../../utils/util';
import { MdChevronRight, MdChevronLeft, MdClose } from "react-icons/md";
import { GbifLogoIcon } from '../../components/Icons/Icons';

export function DetailsDrawer({ dialog, nextItem, previousItem, href, children, ...props }) {
  const theme = useContext(ThemeContext);
  useEffect(() => {
    function handleKeypress(e) {
      if (!dialog.visible) return;
      switch (e.which) {
        case keyCodes.LEFT_ARROW: previousItem ? previousItem() : null; return;
        case keyCodes.RIGHT_ARROW: nextItem ? nextItem() : null; return;
        default: return;
      }
    }
    if (document) {
      document.addEventListener("keydown", handleKeypress, false);
    }

    return function cleanup() {
      if (document) document.removeEventListener("keydown", handleKeypress, false);
    }
  }, [nextItem, previousItem, dialog.visible]);

  return (
    <>
      <DialogBackdrop {...dialog} css={css.detailsBackdrop({theme})}>
        <Dialog {...dialog} aria-label="Details" css={css.drawer()}>
          {dialog.visible &&
            <Root style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
              
              <div style={{flex: '1 1 auto', overflow: 'auto'}}>
                {children}
              </div>
              {(previousItem || nextItem) && <div css={css.footerBar({theme})}>
                {previousItem && <Button css={css.footerItem({theme})} appearance="text" direction="right" tip="previous (left arrow)" onClick={previousItem}>
                  <MdChevronLeft />
                </Button>}

                {href && <Button as="a" target='_blank' href={href} css={css.footerItem({theme})} appearance="text" direction="top" tip="View on GBIF.org">
                  <GbifLogoIcon />
                </Button>}

                {nextItem && <Button css={css.footerItem({theme})} appearance="text" direction="left" tip="next (right arrow)" onClick={nextItem}>
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

DetailsDrawer.propTypes = {
  as: PropTypes.element
};
