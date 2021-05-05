import { css } from '@emotion/react';

//This media query approach isn't ideal. 
// Better would be to calculate the available space and decide based on that since the number of 
// filters applied influence the decision. But this simple approach will perform better and is used for now.
export const table = props => css`
  display: flex;
  flex-direction: column;
  @media (min-height: 700px) {
    height: 100px;
    flex: 1 1 auto;
  }
`;