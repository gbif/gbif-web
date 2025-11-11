import { jsx } from '@emotion/react';
import React from 'react';
import PropTypes from 'prop-types';
import { getClasses } from '../../utils/util';
import * as styles from './styles';
import queryString from 'query-string';
import config from '../../../.env.json';

export function ThumbnailMap({
  as: Div = 'div',
  className,
  filter,
  mapStyle = 'gbif-geyser-en',
  overlayStyle = {
    mode: 'GEO_CENTROID',
    squareSize: 256,
    style: 'scaled.circles'
  },
  ...props
}) {
  const { classNames } = getClasses('gbif', 'thumbnailMap', {/*modifiers goes here*/ }, className);
  return <Div {...props} {...classNames}>
    <div css={styles.thumbnail}>
      <div>
        <img src={`${config.BASEMAPS}/4326/omt/0/0/0@1x.png?style=${mapStyle}&srs=EPSG%3A4326`} />
        <img src={`${config.BASEMAPS}/4326/omt/0/1/0@1x.png?style=${mapStyle}&srs=EPSG%3A4326`} />
      </div>
      <div>
        <img src={`${config.API_V2}/map/occurrence/adhoc/0/0/0@1x.png?srs=EPSG%3A4326&${queryString.stringify(overlayStyle)}&${queryString.stringify(filter)}`} onError={(e) => {
          e.target.style.visibility = 'hidden';
        }}/>
        <img src={`${config.API_V2}/map/occurrence/adhoc/0/1/0@1x.png?srs=EPSG%3A4326&${queryString.stringify(overlayStyle)}&${queryString.stringify(filter)}`} onError={(e) => {
          e.target.style.visibility = 'hidden';
        }}/>
      </div>
    </div>
  </Div>
};

ThumbnailMap.propTypes = {
  as: PropTypes.element
};