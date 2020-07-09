import React, { Component } from "react";
import styled from '@emotion/styled';
import mapboxgl from 'mapbox-gl';
import { ApiContext } from '../../../../dataManagement/api';
import { DetailsDrawer } from '../../../../components';
import { OccurrenceSidebar } from '../../../../entities';
import { useDialogState } from "reakit/Dialog";
import { getLayerConfig } from './getLayerConfig';
import ListBox from './ListBox';
import { ViewHeader } from '../ViewHeader';

const MapAreaComponent = styled('div')(
  {
    flex: "1 1 100%",
    display: "flex",
    height: "100%",
    maxHeight: "100vh",
    flexDirection: "column",
    position: 'relative'
  });

const MapComponent = styled('div')(
  {
    flex: "1 1 100%",
    border: "1px solid #ddd",
    borderRadius: "3px",
    display: "flex",
    flexDirection: "column",
    "& canvas:focus": {
      outline: "none"
    }
  });

class Map extends Component {
  constructor(props) {
    super(props);

    this.addLayer = this.addLayer.bind(this);
    this.updateLayer = this.updateLayer.bind(this);
    this.myRef = React.createRef();
    this.state = {};
  }

  componentDidMount() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA';
    this.map = new mapboxgl.Map({
      container: this.myRef.current,
      style: "mapbox://styles/mapbox/light-v9",
      zoom: sessionStorage.getItem('mapZoom') || 0,
      center: [sessionStorage.getItem('mapLng') || 0, sessionStorage.getItem('mapLat') || 0]
    });
    this.map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-left');
    this.map.on("load", this.addLayer);
  }

  componentWillUnmount() {
    this.map.remove();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.query !== this.props.query && this.mapLoaded) {
      this.updateLayer();
    }
    // if (prevProps.pointData !== this.props.pointData && this.mapLoaded) {
    //   const results = this.props.pointData?.occurrenceSearch?.documents?.total;
    //   this.popup.setHTML(`<p>test</p>`);
    // }
  }

  updateLayer() {
    var layer = this.map.getSource("occurrences");
    if (layer) {
      this.map.removeLayer("occurrences");
      this.map.removeSource("occurrences");
      this.addLayer();
    } else {
      this.addLayer();
    }
  }

  addLayer() {
    this.mapLoaded = true;
    var tileString =
      //"https://esmap.gbif-dev.org/api/tile/{x}/{y}/{z}.mvt?field=coordinates&url=" +
      "http://labs.gbif.org:7012/api/tile/point/{x}/{y}/{z}.mvt?resolution=medium&field=coordinates&url=" +
      // "http://localhost:7012/api/tile/point/{x}/{y}/{z}.mvt?resolution=medium&field=coordinates&url=" +
      // "http://localhost:3000/api/tile/significant/{x}/{y}/{z}.mvt?field=coordinate_point&significantField=backbone.speciesKey&url=" +
      //"http://localhost:3001/api/tile/point/{x}/{y}/{z}.mvt?resolution=high&field=coordinates&url=" +
      encodeURIComponent(`http://c6n1.gbif.org:9200/occurrence/_search?`) +
      "&filter=" + encodeURIComponent(JSON.stringify(this.props.query));
    // tileString = `https://api.gbif.org/v2/map/occurrence/adhoc/{z}/{x}/{y}.mvt?style=scaled.circles&mode=GEO_CENTROID&locale=en&advanced=false&srs=EPSG%3A4326&squareSize=256`;
    this.map.addLayer(
      getLayerConfig(tileString),
      "poi-scalerank2"
    );

    const map = this.map
    // remember map position
    map.on('zoomend', function () {
      const center = map.getCenter();
      sessionStorage.setItem('mapZoom', map.getZoom());
      sessionStorage.setItem('mapLng', center.lng);
      sessionStorage.setItem('mapLat', center.lat);
    });
    map.on('moveend', function () {
      const center = map.getCenter();
      sessionStorage.setItem('mapZoom', map.getZoom());
      sessionStorage.setItem('mapLng', center.lng);
      sessionStorage.setItem('mapLat', center.lat);
    });

    // popover
    var popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });
    this.popup = popup;

    map.on('mouseenter', 'occurrences', function (e) {
      // Change the cursor style as a UI indicator.
      map.getCanvas().style.cursor = 'pointer';
    });

    const loadPointData = this.props.loadPointData;
    const dialog = this.props.dialog;
    map.on('click', 'occurrences', function (e) {
      console.log(e.features[0].properties);
      // Populate the popup and set its coordinates
      // based on the feature found.
      loadPointData({ geohash: e.features[0].properties.geohash, count: e.features[0].properties.count });

      // popup.setLngLat(e.features[0].geometry.coordinates)
      //   .setHTML(e.features[0].properties.count)
      //   .addTo(map);
      // dialog.show();
    });

    map.on('mouseleave', 'occurrences', function () {
      map.getCanvas().style.cursor = '';
      popup.remove();
    });
  }

  render() {
    const { dialog, pointData, pointError, pointLoading, loading, total } = this.props;
    const { activeItemId } = this.state;
    return <>
      <DetailsDrawer dialog={dialog}>
        <OccurrenceSidebar id={activeItemId} defaultTab='details' style={{ width: 700, height: '100%' }} />
      </DetailsDrawer>
      <MapAreaComponent>
        <ViewHeader loading={loading} total={total}/>
        <ListBox onClick={({id}) => {dialog.show(); this.setState({activeItemId: id})}} data={pointData} error={pointError} loading={pointLoading} style={{ zIndex: 10, margin: 20, position: 'absolute', left: 0, bottom: 0, width: 300, maxHeight: 'calc(100% - 60px)' }} />
        <MapComponent ref={this.myRef} />
      </MapAreaComponent>
    </>;
  }
}

const Wrapped = props => {
  const dialog = useDialogState({ animated: true });
  return <ApiContext.Consumer>
    {apiClient => <Map client={apiClient} {...props} dialog={dialog} />}
  </ApiContext.Consumer>
}

export default Wrapped;
// const { data, error, loading, load } = useQuery(OCCURRENCE_TABLE, { lazyLoad: true, keepDataWhileLoading: true });
