import { jsx, css } from '@emotion/react';
import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  useDialogState,
  Dialog as BaseDialog,
  DialogDisclosure,
  DialogBackdrop
} from 'reakit/Dialog';
import ThemeContext from '../../style/themes/ThemeContext';

import * as styles from './styles';
import { MdClose } from 'react-icons/md';
import { Root } from '../Root/Root';

export function Modal({
  disclosure,
  open,
  onClose,
  children,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const dialog = useDialogState({ visible: open, });

  // make the dialog state controlled by the visible prop
  useEffect(() => {
    if (open !== undefined) {
      dialog.setVisible(open);
    }
  }, [open]);

  return (
    <>
      {disclosure && <DialogDisclosure {...dialog} visible={open ?? dialog.visible} ref={disclosure.ref} {...disclosure.props}>
        {(disclosureProps) => React.cloneElement(disclosure, disclosureProps)}
      </DialogDisclosure>}
      <DialogBackdrop {...dialog} visible={open ?? dialog.visible} css={styles.backdrop(theme)} onClick={onClose ?? dialog.hide}>
      </DialogBackdrop>
      <BaseDialog {...dialog} visible={open ?? dialog.visible} css={styles.modal(theme)} {...props}>
        <Root>
          {typeof children === 'function' ?
            children({ dialog }) :
            React.cloneElement(children, { dialog })}
        </Root>
      </BaseDialog>
    </>
  );
};

Modal.propTypes = {
  as: PropTypes.element
};

export function DialogContent({ onCancel, dialog, title, children, ...props }) {
  return <div css={styles.dialog} {...props}>
    <div css={styles.dialogTitle}>
      <div>{title}</div>
      <MdClose css={css`flex: 0 0 auto; color: var(--color500); font-size: 20px;`} onClick={() => {
        onCancel(); 
        dialog.hide;
      }}/>
    </div>
    <div>
      {children}
    </div>
  </div>
}