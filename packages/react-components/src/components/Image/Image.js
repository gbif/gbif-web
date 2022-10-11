import React, { useEffect, useState } from 'react';
import { MdBrokenImage, MdFileDownload } from 'react-icons/md';
import { StripeLoader } from '../Loaders/StripeLoader';

import PropTypes from 'prop-types';

export const getImageSrc = ({ src, w = '', h = '' }) => `https://api.gbif.org/v1/image/unsafe/${w}x${h}/${encodeURIComponent(src)}`;

export const Image = React.forwardRef(({
  src,
  w = '',
  h = '',
  ...props
}, ref) => {
  return <img src={getImageSrc({ src, w, h })} ref={ref} {...props} />
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
  src,
  w = '',
  h = '',
  wrapperProps,
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
    {failed && <div style={{ margin: 'auto', padding: '24px 50px', fontSize: '24px' }}>
      <MdBrokenImage />
    </div>}
    {!failed && <Image {...{ src, w, h }} ref={ref} onError={() => {
      markAsFailed(true);
      setLoading(false);
    }} onLoad={() => setLoading(false)} {...props} />}
  </div>
});