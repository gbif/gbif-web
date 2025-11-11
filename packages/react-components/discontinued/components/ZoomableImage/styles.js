import { css } from '@emotion/react';
// import { focusStyle } from '../../style/shared';

export const zoomableImage = ({src}) => css`
  position: relative;
  /* background: url(${src});
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  position: relative;
  text-align: center; */
`;

export const image = ({src, blur}) => css`
  height: 100%;
  width: 100%;
  background: url(${src});
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  position: relative;
  text-align: center;
  ${blur ? 'filter: blur(8px)' : ''};
`;

export const toolBar = () => css`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(0,0,0,.8);
  color: white;
  padding: 0;
  display: flex;
`;

export default {
  zoomableImage,
  toolBar,
  image
}