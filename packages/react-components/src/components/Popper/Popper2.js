/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useState } from 'react';
import { usePopper } from 'react-popper';
import ReactDOM from 'react-dom';
import FocusTrap from "focus-trap-react";

import { Root } from "../Root/Root";
import styles from './styles';

const Example = props => {
  const { visible, trigger, content, onBackdrop } = props;
  const [referenceElement, setReferenceElement] = React.useState(null);
  const [popperElement, setPopperElement] = React.useState(null);
  const { styles: popperStyles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [
      {
        name: 'preventOverflow',
        options: {
          mainAxis: true, // true by default
          altAxis: true,
          rootBoundary: 'document'
        },
      },
      {
        name: 'offset',
        options: {
          offset: [0, 10],
        },
      }
    ]
  });
  const theme = {};

  return (
    <>
      {React.cloneElement(trigger, { ref: setReferenceElement })}
      {visible && ReactDOM.createPortal(
        <>
          {visible && <div css={styles.backdrop({ theme })} onClick={() => onBackdrop()}></div>}
          <div
            ref={setPopperElement}
            style={popperStyles.popper}
            {...attributes.popper}
          >
            {content}
          </div>
        </>,
        document.body
      )}
    </>
  );
};

export default Example;