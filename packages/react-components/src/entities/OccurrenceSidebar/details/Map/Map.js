/** @jsx jsx */
import { jsx } from '@emotion/core';
import ThemeContext from '../../../../style/themes/ThemeContext';
import { FormattedMessage, FormattedDate } from "react-intl";
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Accordion, Properties } from "../../../../components";
const { Term: T, Value: V } = Properties;

// import * as css from './styles';

export function MapPresentation({
  as: Div = 'div',
  location,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const locationMap = location.reduce((acc, cur) => {
    acc[cur.label]= cur;
    return acc
  }, {})
 
  return <>
  <img src={`https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/static/pin-m(${locationMap.decimalLongitude.value},${locationMap.decimalLatitude.value})/${locationMap.decimalLongitude.value},${locationMap.decimalLatitude.value},11/400x300?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`} />
  <Properties horizontal={true}>
      <T>
      <FormattedMessage
                  id={`ocurrenceFieldNames.latLon`}
                  defaultMessage={"Lat/Lon"}
                />
      </T>
      <V>
            {`${locationMap.decimalLatitude.value}/${locationMap.decimalLongitude.value}`} {locationMap.coordinateUncertaintyInMeters && ` ± ${locationMap.coordinateUncertaintyInMeters.value}m`}
            
      </V>
  </Properties>
  </>
};

MapPresentation.propTypes = {
  as: PropTypes.element
};