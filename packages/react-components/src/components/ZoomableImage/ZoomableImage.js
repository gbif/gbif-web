/* global Image:readonly, document:readonly */
/** @jsx jsx */
import { jsx } from '@emotion/core';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext, useRef, useState, useEffect } from 'react';
import { MdFullscreen, MdFullscreenExit } from 'react-icons/md';
import PropTypes from 'prop-types';
// import { oneOfMany } from '../../utils/util';
import { Button } from '../Button/Button';
import styles from './styles';

export const ZoomableImage = React.forwardRef(({
  src,
  thumbnail,
  ...props
}, ref) => {
  const theme = useContext(ThemeContext);
  const [isFullscreen, setFullscreen] = useState();
  const [imageSrc, setImageSrc] = useState(thumbnail);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setImageSrc(thumbnail);
    if (Image) {
      var downloadingImage = new Image();
      downloadingImage.onload = function(){
        setImageSrc(this.src);
      };
      downloadingImage.src = src;
    }
  },[src, thumbnail]);

  return <div ref={wrapperRef} css={styles.zoomableImage({ theme })} {...props}>
    <div css={styles.image({theme, src: imageSrc, blur: imageSrc === thumbnail})}></div>
    <div css={styles.toolBar({ theme, src })}>
      <Button appearance="text" ref={ref} onClick={() => {
        if (isFullscreen) document.exitFullscreen();
        else wrapperRef.current.requestFullscreen();
        setFullscreen(!isFullscreen);
        }}>
        {isFullscreen ? <MdFullscreenExit /> : <MdFullscreen />}
      </Button>
    </div>
  </div>
});

ZoomableImage.displayName = 'ZoomableImage';

ZoomableImage.propTypes = {
  as: PropTypes.element
};
