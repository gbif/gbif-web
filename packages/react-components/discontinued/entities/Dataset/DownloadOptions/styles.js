import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';


export const options = ({ ...props }) => css`
  display: flex;
  justify-content: left;
  margin: 0;
  > div {
    margin: 12px;
    width: 450px;
    max-width: 100%;
  }
`;

export const card = ({ highlighted, ...props }) => css`
  background: white;
  width: 350px;
  max-width: 100%;
  background: white;
  padding: 24px;
  margin: 12px;
  font-size: 14px;
  h4 {
    font-size: 16px;
    font-weight: bold;
    margin: 0 0 24px 0;
  }
  > div {
    margin-bottom: 12px;
  }
  ${highlighted ? isHighlighted() : ''};
`;

function isHighlighted() {
  return css`
    transform: scale(1.025);
    border-color: #9ecaed;
    box-shadow: 0 0 10px #9ecaed;
  `;
}