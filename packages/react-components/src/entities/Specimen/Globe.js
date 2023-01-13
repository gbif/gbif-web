import { jsx } from '@emotion/react';
import React, { useContext, useEffect } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import * as css from './styles';
import { useQuery } from '../../dataManagement/api';

export function Globe({
  lat,
  lon,
  ...props
}) {
  const { data, error, loading, load } = useQuery(GLOBE, { lazyLoad: true });
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (typeof lat !== 'undefined') {
      load({ variables: { lat, lon } });
    }
  }, [lat, lon]);

  return <div css={css.globe({ theme })} {...props}>
    {!loading && data && <>
      <div css={css.globeSvg({ theme })} dangerouslySetInnerHTML={{__html: data?.point?.svg}}></div>
      <div css={css.globeOverlay({ theme })}></div>
      <div css={css.globeSvg({ theme })} dangerouslySetInnerHTML={{__html: data?.globe?.svg}}></div>
      </>
    }
  </div>
};

const GLOBE = `
query globe($lat: Float!, $lon: Float!){
  point: globe(pLat: $lat, pLon: $lon, sphere: false, graticule: false, land: false) {
    svg
  }
  globe(pLat: $lat, pLon: $lon) {
    svg
  }
}
`;