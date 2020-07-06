import React from 'react';
import PropTypes from 'prop-types';

export const getImageSrc = ({ src, w='', h='' }) => `https://api.gbif.org/v1/image/unsafe/${w}x${h}/${encodeURIComponent(src)}`;

export const Image = React.forwardRef(({
  src,
  w = '',
  h = '',
  ...props
}, ref) => {
  return <img src={getImageSrc({src, w, h})} ref={ref} {...props} />
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
