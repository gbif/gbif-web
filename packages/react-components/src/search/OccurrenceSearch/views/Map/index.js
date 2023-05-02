import React from "react";
import MapPresentation from './MapPresentation';

function Map() {
  if (typeof window !== 'undefined') {
    return <MapPresentation />
  } else {
    return <h1>Map placeholder</h1>
  }
}

export default Map;

