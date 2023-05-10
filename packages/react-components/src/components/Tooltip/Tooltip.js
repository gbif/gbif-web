
import { jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import { Tooltip as TooltipContent, TooltipReference, TooltipArrow, useTooltipState } from "reakit/Tooltip";
import PropTypes from 'prop-types';
// import { oneOfMany } from '../../utils/util';
import * as styles from './styles';

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
      {!!title && <TooltipContent {...tooltip} {...props} css={styles.tooltip({theme})}>
        <TooltipArrow {...tooltip} css={styles.tooltipArrow}/>
        <div>{title}</div>
      </TooltipContent>}
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


