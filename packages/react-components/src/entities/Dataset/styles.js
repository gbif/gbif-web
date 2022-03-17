import { css } from '@emotion/react';
export { bulletList, discreetLink } from '../../style/shared';
export { iconFeatures } from '../../components/IconFeatures/styles';

export const tab = ({ noData, ...props }) => css`
  color: ${noData ? '#888' : null};
`;

export const tabCountChip = ({ ...props }) => css`
  background: #88888847;
  color: #00000085;
  padding: 2px 5px;
  font-size: 10px;
  border-radius: 4px;
  margin: 0 4px;
  font-weight: bold;
`;

export const headerWrapper = ({ ...props }) => css`
  background: white;
  padding: 2rem 1rem 0 1rem;
  h1 {
    margin-top: 0;
    margin-bottom: .25em;
    font-size: 2rem;
    font-weight: 700;
  }
`;

export const summary = ({ ...props }) => css`
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
  >div {
    margin-bottom: 8px;
  }
`;

export const headerFlex = css`
  display: flex;
`;

export const headerContent = css`
  flex: 1 1 auto;
`;

export const headerLogo = css`
  flex: 0 0 auto;
  padding-right: 48px;
  max-width: 250px;
  img {
    width: 100%;
  }
`;

export const headerIcons = css`
  padding: 0 6px;
  align-items: center;
  display: flex;
  > button {
    padding: 7px;
    font-size: 18px;
    color: #555;
  }
`;

export const proseWrapper = ({ ...props }) => css`
  margin: 0 auto;
  width: 1350px;
  max-width: 100%;
`;
