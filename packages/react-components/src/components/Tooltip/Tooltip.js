
import { jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import { Tooltip as TooltipContent, TooltipReference, useTooltipState } from "reakit/Tooltip";
import PropTypes from 'prop-types';
// import { oneOfMany } from '../../utils/util';
import styles from './styles';

// export function Tooltip({
//   as: Div = 'div',
//   ...props
// }) {
//   const theme = useContext(ThemeContext);
//   return <Div css={styles.tooltip({theme})} {...props} />
// };

// Tooltip.propTypes = {
//   as: PropTypes.element
// };

export function Tooltip({ children, title, placement, ...props }) {
  const tooltip = useTooltipState({placement});
  const theme = useContext(ThemeContext);
  return (
    <>
      <TooltipReference {...tooltip} ref={children.ref} {...children.props}>
        {(referenceProps) => React.cloneElement(children, referenceProps)}
      </TooltipReference>
      <TooltipContent {...tooltip} {...props} css={styles.tooltip({theme})}>
        {title}
      </TooltipContent>
    </>
  );
}

function Content(props) {
  const theme = useContext(ThemeContext);
  return <TooltipContent {...props} css={styles.tooltip({theme})} />
}

Tooltip.Content = Content;
Tooltip.Reference = TooltipReference;
Tooltip.useTooltipState = useTooltipState;


