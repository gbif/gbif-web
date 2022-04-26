import { jsx } from '@emotion/react';
import React, { useContext } from "react";
import ThemeContext from '../../../style/themes/ThemeContext';
import MapboxMap from './MapboxMap';
import * as css from './map.styles';

function Map({ query, loading, total, predicateHash, registerPredicate, defaultMapSettings, bbox, style, className, ...props }) {
  const theme = useContext(ThemeContext);

  return <MapboxMap 
    {...{style, className}} 
    defaultMapSettings={defaultMapSettings} 
    predicateHash={predicateHash} 
    css={css.mapComponent({theme})} 
    theme={theme} 
    query={query} 
    onMapClick={e => showList(false)} 
    registerPredicate={registerPredicate} 
    bbox={bbox} />;
}

export default Map;
