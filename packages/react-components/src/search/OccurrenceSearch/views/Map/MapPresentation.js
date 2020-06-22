import React, { Component } from "react";
import styled from '@emotion/styled';
import mapboxgl from 'mapbox-gl';
// import { compose } from '../../api/queryAdapter';

/*
field: coordinates
url: http://labs.gbif.org:7011/_search?
filter: {"bool":{"filter":{"term":{"datasetKey":"4fa7b334-ce0d-4e88-aaae-2e0c138d049e"}}}}
*/

const MapAreaComponent = styled('div')(
  {
    flex: "1 1 100%",
    display: "flex",
    height: "100%",
    maxHeight: "100vh",
    flexDirection: "column"
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
      // "http://localhost:3000/api/tile/significant/{x}/{y}/{z}.mvt?field=coordinate_point&significantField=backbone.speciesKey&url=" +
      //"http://localhost:3001/api/tile/point/{x}/{y}/{z}.mvt?resolution=high&field=coordinates&url=" +
      encodeURIComponent(`http://c6n1.gbif.org:9200/occurrence/_search?`) +
      "&filter=" + encodeURIComponent(JSON.stringify(this.props.query));
    this.map.addLayer(
      {
        id: "occurrences",
        type: "circle",
        source: {
          type: "vector",
          tiles: [tileString]
        },
        "source-layer": "occurrences",
        paint: {
          // make circles larger as the user zooms from z12 to z22
          "circle-radius": {
            property: "count",
            type: "interval",
            //stops: [[0, 2]]
            stops: [[0, 2], [10, 3], [100, 5], [1000, 8], [10000, 15]]
          },
          // color circles by ethnicity, using data-driven styles
          "circle-color": {
            property: "count",
            type: "interval",
            stops: [
              [0, "#fed976"], //#b99939
              [10, "#fd8d3c"],
              [100, "#fd8d3c"], //#b45100
              [1000, "#f03b20"], //#a40000
              [10000, "#bd0026"]
            ] //#750000
          },
          "circle-opacity": {
            property: "count",
            type: "interval",
            stops: [[0, 1], [10, 0.8], [100, 0.7], [1000, 0.6], [10000, 0.6]]
          },
          "circle-stroke-color": {
            property: "count",
            type: "interval",
            stops: [
              [0, "#fe9724"], //#b99939
              [10, "#fd5b24"],
              [100, "#fd471d"], //#b45100
              [1000, "#f01129"], //#a40000
              [10000, "#bd0047"]
            ] //#750000
          },
          "circle-stroke-width": {
            property: "count",
            type: "interval",
            stops: [[0, 1], [10, 0]]
          }
        }
      },
      "poi-scalerank2"
    );

    const map = this.map
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
  }

  render() {
    return (
      <MapAreaComponent>
        <MapComponent ref={this.myRef} />
      </MapAreaComponent>
    );
  }
}

export default Map;
