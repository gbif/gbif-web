import { css } from '@emotion/react';
import { skeletonLoading } from '../../style/shared';

export const gallery = props => css`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 0;
  margin: -6px;
`;

export const galleryTileImage = ({ theme, height = 150 }) => css`
  height: ${height}px;
  width: 100%;
  background: #88888822;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  &:hover {
    box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.3);
  }
`;

export const galleryTile = ({ height = 150 }) => css`
  flex: 1 1 auto;
  width: 150px;
  margin: 6px;
  display: block;
  overflow: hidden;
  /* border: 1px solid rgba(0,0,0,.2); */
  & img {
    display: none;
  }
`;

export const caption = props => css`
  font-size: .80em;
  font-weight: 600;
  padding-top: 2px;
`;

export const more = props => css`
  flex: 100 1 auto;
  display: flex;
  height: ${props.height || 150}px;
  align-items: center;
  color: #888;
  min-width: 100px;
  padding-left: 30px; 
`;

// export const slideIn = props => css`
//   opacity: 1;
//   transform: translateX(0);
// `;
export const detailPage = props => css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #00000010;
  /* opacity: 0;
  transform: translateX(${props.rtl ? -100 : 100}%);
  transition: opacity 6.2s linear, transform 6.2s ease-in-out;
  ${props.show ? slideIn(props) : ''}; */
`;

export const detailHeader = props => css`
  border-bottom: 1px solid #e8e8e8;
  padding: 10px 20px;
  h2 {
    font-size: 14px;
    margin: 0;
  }
`;

export const detailDrawerBar = props => css`
  border: 1px solid #e8e8e8;
  border-width: 0 1px;
`;

export const detailMainWrapper = props => css`
  flex: 1 1 auto;
  max-width: 100%;
  overflow: auto;
`;

export const detailMain = props => css`
  background: #f5f5f5;
  display: flex;
  position: relative;
  >div {
    flex: 1 1 auto;
  }
`;

export const detailHeaderDescription = props => css`
  color: #767676;
  font-size: 13px;
  margin-top: 5px;
`;

export const detailDrawerContent = props => css`
  overflow: auto;
  >div {
    width: 300px;
  }
`;

export const detailNav = props => css`
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  z-index: 1;
  opacity: 0;
  padding: 0 10px;
  transition: opacity 0.1s ease-in;
  background: rgba(0,0,0,.4);
  color: white;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }
`;

export const detailPrev = props => css`
  ${detailNav(props)};
  left: 0;
`;

export const detailNext = props => css`
  ${detailNav(props)};
  right: 0;
`;

export const skeletonTile = props => css`
  height: ${props.height}px;
  width: ${props.height * 1.2}px;
  flex: 1 1 auto;
  margin: 6px;
  animation: ${skeletonLoading} 3s linear infinite;
`;