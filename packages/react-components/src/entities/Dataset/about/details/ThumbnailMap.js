import { jsx } from '@emotion/react';
import React, { useContext } from 'react';
import ThemeContext from '../../../../style/themes/ThemeContext';
import * as css from '../styles';
import env from '../../../../../.env.json';

export function ThumbnailMap({
  dataset,
  ...props
}) {
  return <div css={css.thumbnail}>
    <div>
      <img src={`${env.BASEMAPS}/4326/omt/0/0/0@1x.png?style=gbif-light&srs=EPSG%3A4326`} />
      <img src={`${env.BASEMAPS}/4326/omt/0/1/0@1x.png?style=gbif-light&srs=EPSG%3A4326`} />
    </div>
    <div>
      <img src={`${env.API_V2}/map/occurrence/density/0/0/0@2x.png?style=classic.poly&bin=hex&hexPerTile=79&datasetKey=${dataset.key}&srs=EPSG%3A4326`} onError={i => i.target.style.visibility ='hidden'} />
      <img src={`${env.API_V2}/map/occurrence/density/0/1/0@2x.png?style=classic.poly&bin=hex&hexPerTile=79&datasetKey=${dataset.key}&srs=EPSG%3A4326`} onError={i => i.target.style.visibility ='hidden'} />
    </div>
  </div>
};
