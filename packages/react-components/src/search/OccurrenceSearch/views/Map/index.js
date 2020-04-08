import React from 'react';
import withFilter from '../../filters/state/withFilter';
import MapPresentation from './MapPresentation';

const Map = props => {
  return <MapPresentation {...props} />
  // return <h1>test</h1>
}

const mapContextToProps = ({ filter, filterHash }) => ({ filter, filterHash });
export default withFilter(mapContextToProps)(Map);
