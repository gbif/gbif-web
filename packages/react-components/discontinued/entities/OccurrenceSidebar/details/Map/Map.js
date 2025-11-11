import { jsx } from '@emotion/react';
import ThemeContext from "../../../../style/themes/ThemeContext";
import { FormattedMessage } from "react-intl";
import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Properties } from "../../../../components";
const { Term: T, Value: V } = Properties;

// import * as css from './styles';

export function MapPresentation({ as: Div = "div", location, ...props }) {
  const theme = useContext(ThemeContext);
  const locationMap = location.reduce((acc, cur) => {
    acc[cur.label] = cur;
    return acc;
  }, {});

  return (
    <>
      <div style={{ maxWidth: "100%", position: "relative" }}>
        <img
          style={{ display: "block", maxWidth: "100%" }}
          src={`https://api.mapbox.com/styles/v1/mapbox/light-v9/static/pin-s-circle+285A98(${locationMap.decimalLongitude.value},${locationMap.decimalLatitude.value})/${locationMap.decimalLongitude.value},${locationMap.decimalLatitude.value},13,0/600x300@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`}
        />
        <img
          style={{
            border: "1px solid #aaa",
            width: "30%",
            position: "absolute",
            bottom: 0,
            right: 0,
          }}
          src={`https://api.mapbox.com/styles/v1/mapbox/light-v9/static/pin-s-circle+dedede(${locationMap.decimalLongitude.value},${locationMap.decimalLatitude.value})/${locationMap.decimalLongitude.value},${locationMap.decimalLatitude.value},4,0/200x100@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`}
        />
      </div>
      <Properties>
        <T>
          <FormattedMessage
            id={`occurrenceFieldNames.latLon`}
            defaultMessage={"Lat/Lon"}
          />
        </T>
        <V>
          {`${locationMap.decimalLatitude.value}/${locationMap.decimalLongitude.value}`}{" "}
          {locationMap.coordinateUncertaintyInMeters &&
            ` ± ${locationMap.coordinateUncertaintyInMeters.value}m`}
        </V>
      </Properties>
    </>
  );
}

MapPresentation.propTypes = {
  as: PropTypes.element,
};
