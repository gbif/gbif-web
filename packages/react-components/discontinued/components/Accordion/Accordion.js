
import { jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import { uncontrollable } from 'uncontrollable';
// import PropTypes from 'prop-types';
// import { oneOfMany } from '../../utils/util';
import styles from './styles';

function AccordionControlled({
  summary,
  summaryStyle,
  open,
  onToggle,
  children,
  ...props
}) {
  const theme = useContext(ThemeContext);
  return <details css={styles.accordion({ theme })} {...props} open={open} >
    <summary style={summaryStyle} css={styles.summary({ theme })}
      onClick={e => {
        if (e.target.href) return;
        e.preventDefault();
        onToggle(!open);
      }}>
        <div>
          <div style={{flex: '1 1 auto'}}>{summary}</div>
          <div style={{flex: '0 0 auto'}} css={open ? styles.arrowUp({}) : styles.arrowDown({})}></div>
        </div>
      </summary>
    <div css={styles.content({ theme })}>
      {children}
    </div>
  </details>
}

// Accordion.propTypes = {

// };

export const Accordion = uncontrollable(AccordionControlled, {
  open: 'onToggle'
});
Accordion.displayName = 'Accordion';