
import { jsx } from '@emotion/react';
import React from 'react';
import { Tooltip as TooltipContent, TooltipReference, TooltipArrow, useTooltipState } from "reakit/Tooltip";
import PropTypes from 'prop-types';
import * as styles from './styles';


export function Tooltip({ children, title, placement, ...props }) {
  const tooltip = useTooltipState({placement});
  return (
    <>
      <TooltipReference {...tooltip} ref={children.ref} {...children.props}>
        {(referenceProps) => React.cloneElement(children, referenceProps)}
      </TooltipReference>
      <TooltipContent {...tooltip} {...props} css={styles.tooltip}>
        <TooltipArrow {...tooltip} css={styles.tooltipArrow}/>
        <div>{title}</div>
      </TooltipContent>
    </>
  );
}

function Content(props) {
  return <TooltipContent {...props} css={styles.tooltip} />
}

Tooltip.Content = Content;
Tooltip.Reference = TooltipReference;
Tooltip.useTooltipState = useTooltipState;


