import React, { useRef, useCallback, useState, useEffect, useContext } from 'react';
import { css } from '@emotion/react';
import 'ol/ol.css';
import { Map, Overlay, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { transform } from 'ol/proj';
import { Style, Fill, Stroke } from 'ol/style';
import { WKT } from 'ol/format';
import Select from 'ol/interaction/Select';
import { altKeyOnly, click, pointerMove } from 'ol/events/condition';
import { colorMap } from './colorMap';

import MapComponentOL from '../../OccurrenceSearch/views/Map/OpenlayersMap';
import SearchContext from '../../SearchContext';
import { FilterContext } from '../../../widgets/Filter/state';
import { filter2v1 } from '../../../dataManagement/filterAdapter';
var format = new WKT();

function itemToFeature({ geometry, ...item }) {
  // Parse the WKT string using OpenLayers
  try {
    var feature = format.readFeature(geometry, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:4326',
    });

    // Set the color property on the feature's properties object
    feature.setProperties({ ...item, color: colorMap[item.annotation] || colorMap['OTHER'] });
    return { feature };
  } catch (e) {
    return { error: e }
  }
}

const OpenLayersMap = ({ data, onPolygonSelect }) => {
  const [params, setParams] = useState({});
  const currentFilterContext = useContext(FilterContext);
  const { rootPredicate, predicateConfig } = useContext(SearchContext);
  const [map, setMap] = useState(null);

  const handleMapCreation = useCallback((olMap) => {
    setMap(olMap);
  }, []);


  const handleLayerChange = useCallback((map) => {
    // if (map) {
    //   const vectorLayer = new VectorLayer({
    //     source: new VectorSource({
    //       features: data.map(itemToFeature).filter(({ error }) => !error).map(({ feature }) => feature)
    //     }),
    //     style: feature => {
    //       const color = '#ff0000';
    //       return new Style({
    //         fill: new Fill({
    //           color: color + '80'
    //         }),
    //         stroke: new Stroke({
    //           color: color,
    //           width: 2
    //         })
    //       });
    //     }
    //   });
    //   vectorLayer.setZIndex(100);
    //   // map.addLayer(vectorLayer);
    // }
  }, [map, data]);

  useEffect(() => {
    const { v1Filter, error } = filter2v1(currentFilterContext.filter, predicateConfig);
    const filter = { ...v1Filter, ...rootPredicate };
    setParams(filter);
  }, [currentFilterContext.filterHash]);

  useEffect(() => {
    if (map) {

      map.on('click', function (e) {
        console.log(map.getAllLayers());
        debugger;
        // const vectorLayer = new VectorLayer({
        //   source: new VectorSource({
        //     features: data.map(itemToFeature).filter(({ error }) => !error).map(({ feature }) => feature)
        //   }),
        //   style: feature => {
        //     const color = '#ff0000';
        //     return new Style({
        //       fill: new Fill({
        //         color: color + '80'
        //       }),
        //       stroke: new Stroke({
        //         color: color,
        //         width: 2
        //       })
        //     });
        //   }
        // });
        // map.addLayer(vectorLayer);

      });

    }
  }, [map, data]);

  return <MapComponentOL mapConfig={{
    "basemapStyle": "https://graphql.gbif-staging.org/unstable-api/map-styles/4326/gbif-raster?styleName=natural&background=%23e5e9cd&language=en&pixelRatio=2",
    "projection": "EPSG_4326"
  }}
    // onMapCreate={handleMapCreation}
    // onLayerChange={handleLayerChange}
    // params={params}
    // data={data.map(itemToFeature).filter(({ error }) => !error).map(({ feature }) => feature)}
    css={css`width: 100%; height: 100%;`}
  // latestEvent={latestEvent} 
  // defaultMapSettings={defaultMapSettings} 
  // predicateHash={predicateHash} 
  // q={q} 
  // query={query} 
  // onMapClick={e => showList(false)} 
  // onPointClick={data => { showList(true); loadPointData(data) }} 
  // registerPredicate={registerPredicate}
  />
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  const popupCloseRef = useRef(null);
  const [selectedFeatures, setSelectedFeatures] = React.useState(null);

  useEffect(() => {
    if (mapRef.current) {
      const osmLayer = new TileLayer({
        source: new OSM()
      });

      const vectorLayer = new VectorLayer({
        source: new VectorSource({
          features: data.map(itemToFeature).filter(({ error }) => !error).map(({ feature }) => feature)
        }),
        style: feature => {
          const { color } = feature.getProperties();
          const test = feature.getProperties();
          return new Style({
            fill: new Fill({
              color: color + '80'
            }),
            stroke: new Stroke({
              color: color,
              width: 2
            })
          });
        }
      });

      const map = new Map({
        target: mapRef.current,
        layers: [osmLayer, vectorLayer],
        view: new View({
          center: transform([0, 0], 'EPSG:4326', 'EPSG:3857'),
          zoom: 2
        })
      });

      // vectorLayer.getSource().on('featureclick', event => {
      //   const feature = event.feature;
      //   debugger;
      //   const { id } = feature.getProperties();
      //   onPolygonSelect(id);
      // });



      // const selected = new Style({
      //   fill: new Fill({
      //     color: '#eeeeee',
      //   }),
      //   stroke: new Stroke({
      //     color: 'rgba(255, 255, 255, 0.7)',
      //     width: 2,
      //   }),
      // });

      // function selectStyle(feature) {
      //   const color = feature.get('COLOR') || '#eeeeee';
      //   selected.getFill().setColor(color);
      //   return selected;
      // }

      // // select interaction working on "click"
      // const selectClick = new Select({
      //   condition: click,
      //   style: selectStyle,
      // });

      // map.addInteraction(selectClick);

      // selectClick.on('select', function(evt){
      //   if (evt.selected.length === 0) {

      //   }
      // });


      // When the map is clicked, run this function
      map.on('click', function (e) {

        // Find the feature that was clicked on
        const clickedFeatures = [];
        // var feature = map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
        map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
          // return feature;
          clickedFeatures.push(feature);
        }, {
          layerFilter: function (layer) {
            return layer === vectorLayer;
          }
        });

        const feature = clickedFeatures[0];
        // If we found a feature, create a popup and display its properties
        if (feature) {
          if (clickedFeatures.length > 1) {

          } else if (clickedFeatures.length === 1) {
          }

          setSelectedFeatures(clickedFeatures.map(f => f.getProperties()));

          // Call your function with the feature properties
          onPolygonSelect(feature.getProperties(), clickedFeatures.map(f => f.getProperties().id));

          // Create the popup overlay
          var popupOverlay = new Overlay({
            element: popupRef.current,
            positioning: 'bottom-center',
            offset: [0, -15],
            autoPan: true,
            autoPanAnimation: {
              duration: 250
            }
          });

          popupCloseRef.current.onclick = function () {
            popupOverlay.setPosition(undefined);
            popupCloseRef.current.blur();
            setSelectedFeatures();
            selectClick.getFeatures().clear();
            return false;
          };


          // Add the popup overlay to the map and show it at the clicked location
          map.addOverlay(popupOverlay);
          popupOverlay.setPosition(e.coordinate);
        }
      });

      return () => {
        if (map) {
          map.dispose();
        }
      };
    }
  }, [data, onPolygonSelect, setSelectedFeatures]);

  return <>
    <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
    <div ref={popupRef} css={popup} style={{ display: selectedFeatures ? 'block' : 'none' }}>
      <a ref={popupCloseRef} href="#" id="popup-closer" css={popupCloser}></a>
      {selectedFeatures && <div id="popup-content">{selectedFeatures.map(x => x.annotation).join(', ')}</div>}
    </div>
  </>;
};

export default OpenLayersMap;

const popup = css`
  position: absolute;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  min-width: 50px;
  &:after, &:before {
    top: 100%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }
  &:after {
    border-top-color: white;
    border-width: 10px;
    left: 48px;
    margin-left: -10px;
  }
  &:before {
    border-top-color: #cccccc;
    border-width: 11px;
    left: 48px;
    margin-left: -11px;
  }
`;

const popupCloser = css`
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
  
  &:after {
    content: "✖";
  }
`;