/* global Image:readonly, document:readonly */

import { jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext, useRef, useState, useEffect, useCallback } from 'react';
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
      downloadingImage.onload = function () {
        setImageSrc(this.src);
      };
      downloadingImage.src = src;
    }
  }, [src, thumbnail]);

  const handleFullScreenChange = useCallback(event => {
    // Surprisingly the only way to tell if full screen is to compare.
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/onfullscreenchange
    setFullscreen(document.fullscreenElement === wrapperRef.current);
  });

  useEffect(() => {
    wrapperRef.current.onfullscreenchange = handleFullScreenChange;
    return () => {
      wrapperRef.current.onfullscreenchange = undefined;
    }
  }, [handleFullScreenChange]);

  return <div ref={wrapperRef} css={styles.zoomableImage({ theme })} {...props}>
    <div css={styles.image({ theme, src: imageSrc, blur: imageSrc === thumbnail })}></div>
    <div css={styles.toolBar({ theme, src })}>
      <Button style={{ padding: 10 }} appearance="text" ref={ref} onClick={() => {
        if (isFullscreen) document.exitFullscreen();
        else wrapperRef.current.requestFullscreen();
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
