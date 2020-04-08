/** @jsx jsx */
import { jsx } from '@emotion/core';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { createPopper } from '@popperjs/core';
import Portal from "./Portal";
import { Root } from "../Root/Root";
import FocusTrap from "focus-trap-react";
import styles from './styles';

export class Popper extends React.Component {
  constructor(props) {
    super(props);
    const { trigger, content } = props;
    this.triggerRef = React.createRef();
    this.contentRef = React.createRef();
    this.arrowRef = React.createRef();
    this.state = {
      placement: 'top'
    };
  }

  componentDidMount() {
    const setState = this.setState.bind(this)

    this.popperInstance = createPopper(this.triggerRef.current, this.contentRef.current, {
      // onFirstUpdate: state => console.log('Popper positioned on', state.placement),
      placement: this.state.placement,
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
          name: 'arrow',
          options: {
            element: this.arrowRef.current,
            padding: 5, // 5px from the edges of the popper
          },
        },
        {
          name: 'offset',
          options: {
            offset: [0, 10],
          },
        },
        {
          // https://popper.js.org/docs/v2/modifiers/#custom-modifiers
          name: "updateState",
          phase: "write",
          enabled: true,
          fn({ state }) {
            setState({ placement: state.placement });
          }
        }
      ]
    });
  }

  componentWillUnmount() {
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      this.scheduleUpdate();
      setTimeout(()=>{
        this.props.focusRef.current.focus();
      }, 0);
    }
  }

  scheduleUpdate = () => {
    if (this.popperInstance) {
      this.popperInstance.update();
    }
  };

  render() {
    const theme = {};
    const { visible, trigger, content, onBackdrop } = this.props;
    console.log(this.props.focusRef);
    return (
      <>
        {React.cloneElement(trigger, { ref: this.triggerRef, 'aria-expanded': visible, 'aria-controls': "id-cutnrt", 'aria-haspopup': "dialog" })}
        <Portal>
          {this.props.visible && <div css={styles.backdrop({theme})} onClick={() => onBackdrop()}></div>}
          <Root ref={this.contentRef} css={styles.popper({theme})}>
            <div ref={this.arrowRef} css={styles.arrow({
              placement: this.state.placement,
              visible: this.props.visible,
              theme
            })}>
              <Arrow placement={this.state.placement}/>
            </div>
            {this.props.visible && <FocusTrap focusTrapOptions={{
                onDeactivate: onBackdrop,
                clickOutsideDeactivates: true,
                initialFocus: this.props.focusRef.current
              }}>
                <div>
                {content}
                </div>
            </FocusTrap>}
          </Root>
        </Portal>
      </>
    )
  }
}

const arrowPlacement = {
  top: 180,
  bottom: 0,
  left: 90,
  right: 270
};

function Arrow({placement, ...props}) {
  return <svg viewBox="0 0 30 30" style={{transform: `rotateZ(${arrowPlacement[placement]}deg)`}}>
    <path className="gb-popover-arrow-stroke" d="M23.7,27.1L17,19.9C16.5,19.3,15.8,19,15,19s-1.6,0.3-2.1,0.9l-6.6,7.2C5.3,28.1,3.4,29,2,29h26 C26.7,29,24.6,28.1,23.7,27.1z"></path>
    <path className="gb-popover-arrow-fill" d="M23,27.8c1.1,1.2,3.4,2.2,5,2.2h2H0h2c1.7,0,3.9-1,5-2.2l6.6-7.2c0.7-0.8,2-0.8,2.7,0L23,27.8L23,27.8z"></path>
  </svg>
}
