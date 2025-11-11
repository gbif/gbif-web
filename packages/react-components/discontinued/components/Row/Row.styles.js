import { css } from '@emotion/react';
// import { helper } from '../../utils/helper';

export const row = props => css`
  display: flex;
  flex-direction: ${props.direction || null};
  flex-wrap: ${props.wrap ? props.wrap : 'wrap'};
  align-items: ${props.alignItems ? props.alignItems : null};
  margin: ${props.halfGutter ? -props.halfGutter + 'px' : null};
  justify-content: ${props.justifyContent ? props.justifyContent : null};
  >* {
    padding: ${props.halfGutter? props.halfGutter + 'px' : null};
  }
`;

const asFlexValue = (bool = true) => bool ? 1 : 0;

const getFlexSize = (size, breakpoint) => css`
  @media (min-width: ${breakpoint}px) {
    flex-basis: ${size ? size*100/24 + '%' : null};
  }
`;

export const col = ({shrink, grow, basis, xs, ...props}) => css`
  flex-grow: ${asFlexValue(grow)};
  flex-shrink: ${asFlexValue(shrink)};
  flex-basis: ${basis ? typeof basis === 'number' ? basis + '%' : basis : 'auto'};
  flex-basis: ${xs ? xs*100/24 + '%' : null};
  ${getFlexSize(props.sm, 600)};
  ${getFlexSize(props.md, 700)};
  ${getFlexSize(props.lg, 800)};
  ${getFlexSize(props.xl, 1000)};
`;