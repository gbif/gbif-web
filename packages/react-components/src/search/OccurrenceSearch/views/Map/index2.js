import React from 'react';
import { withFilter } from '../../../../widgets/Filter/state';
import MapPresentation from './MapPresentation';

const Map = props => {
  if (typeof window !== 'undefined') {
    return <MapPresentation {...props} />
  } else {
    return <h1>Map placeholder</h1>
  }
}

const mapContextToProps = ({ filter, filterHash }) => ({ filter, filterHash });
export default withFilter(mapContextToProps)(Map);
