import React, { useEffect, useState } from 'react';
import { MdBrokenImage, MdFileDownload } from 'react-icons/md';
import { StripeLoader } from '../Loaders/StripeLoader';

import PropTypes from 'prop-types';

export const getImageSrc = ({ src, w = '', h = '' }) => `https://api.gbif.org/v1/image/unsafe/${w}x${h}/${encodeURIComponent(src)}`;

export const Image = React.forwardRef(({
  src,
  w = '',
  h = '',
  getSrc,
  ...props
}, ref) => {
  const getSource = getSrc ?? getImageSrc;
  return <img src={getSource({ src, w, h })} ref={ref} {...props} />
});

Image.propTypes = {
  src: PropTypes.string.isRequired,
  w: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  h: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

Image.getImageSrc = getImageSrc;


const failedStyle = {
  background: 'tomato',
  height: 100,
  width: 100,
  display: 'inline-block'
};

export const OptImage = React.forwardRef(({
  wrapperProps,
  onLoad,
  style = {},
  src,
  ...props
}, ref) => {
  const [failed, markAsFailed] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    markAsFailed(false);
    setLoading(true);
  }, [src]);

  return <div style={{ display: 'inline-block'}} {...wrapperProps}>
    <StripeLoader active={loading} error={failed} style={{width: '100%', height: 10}}/>
    {loading && <>
      <div style={{ width: '100%', height: 100, fontSize: '24px' }}></div>
      </>}
    {failed && <div className="gb-image-failed">
      <div>
        <MdBrokenImage />
      </div>
    </div>}
    {!failed && <img src={src} {...props} style={{...style, display: loading ? 'none' : 'block'}} ref={ref} onError={() => {
      markAsFailed(true);
      setLoading(false);
    }} onLoad={(e) => {
      setLoading(false);
      onLoad && onLoad(e);
    }} {...props} />}
  </div>
});
OptImage.getImageSrc = getImageSrc;