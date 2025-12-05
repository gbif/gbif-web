import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';

// export const withSideBar = ({ hasSidebar, ...props }) => css`
//   display: grid;
//   grid-template-columns: 1fr ${hasSidebar ? '350px' : ''};
//   grid-column-gap: 12px;
// `;

// export const sideBarNav = ({ ...props }) => css`
//   top: var(--stickyOffset);
//   position: sticky;
//   div {
//     background: white;
//     margin-bottom: 12px;
//     overflow: hidden;
//     padding: 4px;
//     border: 1px solid var(--paperBorderColor);
//     border-radius: var(--borderRadiusPx);
//     ul {
//       list-style: none;
//       padding: 0;
//       margin: 0;
//     }
//   }
// `;

// export const sideBar = ({ ...props }) => css`
//   flex: 0 0 250px;
//   padding-top: 12px;
//   margin: 0;
//   font-size: 14px;
//   position: sticky;
//   top: 0;
//   align-self: flex-start;
//   height: 100%;
// `;

// export const sidebarCard = css`
//   padding: 12px;
//   display: flex;
// `;

export const sidebarIcon = css`
  flex: 0 0 auto;
  div {
    padding: 8px 0;
    text-align: center;
    background: var(--primary500);
    color: white;
    font-weight: 900;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    line-height: 25px;
    padding: 0;
    text-align: center;
    padding-top: 2px;
  }
`;

export const sidebarOccurrenceCardWrapper = ({isHorisontal}) => css`
${isHorisontal ? `
    display: flex;
    flex-direction: row-reverse;
    border-bottom: 1px solid #eee;
    > a, > div {
      flex: 0 0 50%;
    }
  ` : ''}
  img {
    width: 100%;
    border-radius: 4px 4px 0 0;
  }
`;

export const sidebarCardContent = css`
  padding-left: 12px;
  flex: 1 1 auto;
  a {
    color: inherit;
  }
  h5 {
    font-size: 13px;
    margin: 3px 0 0 0;
    font-weight: bold;
  }
  p {
    font-size: 13px;
    color: #888;
    margin: 0;
    margin-top: 8px;
  }
`;