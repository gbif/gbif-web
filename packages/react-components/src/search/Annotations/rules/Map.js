import React, { useRef, useCallback, useState, useEffect, useContext } from 'react';
import { css } from '@emotion/react';
import 'ol/ol.css';
import { Overlay } from 'ol';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Fill, Stroke } from 'ol/style';
import { WKT } from 'ol/format';
import { colorMap } from './colorMap';
import { MultiPolygon, Polygon } from 'ol/geom.js';


import MapPresentation from '../../OccurrenceSearch/views/Map/MapPresentation';
import SearchContext from '../../SearchContext';
import { MdDeleteOutline as DeleteIcon, MdDraw } from 'react-icons/md';

import { FilterContext } from '../../../widgets/Filter/state';
import { filter2predicate, filter2v1 } from '../../../dataManagement/filterAdapter';
import { Button } from '../../../components';
import UserContext from '../../../dataManagement/UserProvider/UserContext';

const mapConfig = {
  defaultProjection: 'PLATE_CAREE',
  defaultMapStyle: 'NATURAL',
  mapStyles: {
    PLATE_CAREE: ['NATURAL', 'BRIGHT', 'DARK', 'BRIGHT_IUCN'],
    // MERCATOR: ['SATELLITE'],
  },
}

const Map = ({ data, polygons, setPolygons, onPolygonSelect }) => {
  const { user } = useContext(UserContext);
  const [predicate, setPredicate] = useState();
  const [params, setParams] = useState({});
  const [basemapParams, setBasemapParams] = useState({});
  const [drawActive, setDrawState] = useState(false);
  const [deleteActive, setDeleteState] = useState(false);
  const currentFilterContext = useContext(FilterContext);
  const { rootPredicate, predicateConfig } = useContext(SearchContext);
  const [map, setMap] = useState(null);

  const popupRef = useRef(null);
  const popupCloseRef = useRef(null);
  const [selectedFeatures, setSelectedFeatures] = React.useState(null);

  const handleMapCreation = useCallback((olMap) => {
    setMap(olMap);
  }, []);


  const handleLayerChange = useCallback((map) => {
    if (map) {
      // first remove the existing annotations layer
      map.getLayers().getArray()
        .filter(layer => layer.get('name') === 'Annotations')
        .forEach(layer => map.removeLayer(layer));

      // then add the new annotations layer
      const vectorLayer = new VectorLayer({
        source: new VectorSource({
          features: data.map(itemToFeature).filter(({ error }) => !error).map(({ feature }) => feature)
        }),
        name: 'Annotations',
        style: feature => {
          const { color } = feature.getProperties();
          return new Style({
            fill: new Fill({
              color: color + '40'
            }),
            stroke: new Stroke({
              color: color,
              width: 2
            })
          });
        }
      });
      vectorLayer.setZIndex(1000);
      map.addLayer(vectorLayer);
    }
  }, [map, data]);

  useEffect(() => {
    const { v1Filter, error } = filter2v1(currentFilterContext.filter, predicateConfig);
    const filter = { ...v1Filter, ...rootPredicate };
    setParams(filter);
    setBasemapParams({ taxonKey: filter.taxonKey });
    setSelectedFeatures();
    
    // remove projectId from filter
    const prunedFilter = JSON.parse(JSON.stringify(currentFilterContext.filter));
    delete prunedFilter?.must?.projectId;

    // if there is no datasetKey of taxonKey filters, then add a taxonKey filter with an impossible value to ensure nothing is shown
    let optionalExcludeAllPredicate;
    if (!prunedFilter?.must?.datasetKey && !prunedFilter?.must?.taxonKey) {
      optionalExcludeAllPredicate = {
        key: 'taxonKey',
        type: 'equals',
        value: -1
      }
    }
    // construct controlled predicate for map presentation
    const predicate = {
      type: 'and',
      predicates: [
        rootPredicate,
        filter2predicate(prunedFilter, predicateConfig),
        {
          type: 'equals',
          key: 'hasCoordinate',
          value: true
        },
        {
          type: 'equals',
          key: 'hasGeospatialIssue',
          value: false
        },
        optionalExcludeAllPredicate
      ].filter(x => x)
    };
    setPredicate(predicate);
    console.log('predicate', predicate);
  }, [currentFilterContext.filterHash]);

  useEffect(() => {
    handleLayerChange(map);
  }, [data, map]);

  useEffect(() => {
    let clickListener;
    if (map) {
      clickListener = function (e) {
        // if the draw is active, we don't want to show the popup
        if (drawActive) return;
        // Find the feature that was clicked on
        const clickedFeatures = [];
        // var feature = map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
        map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
          // return feature;
          clickedFeatures.push(feature);
        }, {
          layerFilter: function (layer) {
            return layer.get('name') === 'Annotations';
          }
        });

        const feature = clickedFeatures[0];
        // If we found a feature, create a popup and display its properties
        if (feature) {
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
            // selectClick.getFeatures().clear();
            return false;
          };


          // Add the popup overlay to the map and show it at the clicked location
          map.addOverlay(popupOverlay);
          popupOverlay.setPosition(e.coordinate);
        }
      }
      map.on('click', clickListener);
    }
    return function cleanup() {
      if (clickListener && map) {
        map.un('click', clickListener);
      }
    };
  }, [map, data, drawActive]);

  return <>
    <MapPresentation 
      mapSettings={mapConfig}
      predicate={predicate}
      basemapParams={basemapParams}
      params={params}
      query={params}
      css={css`width: 100%; height: 100%;`}
      mapProps={
        {
          onMapCreate: handleMapCreation,
          onLayerChange: handleLayerChange,
          polygons,
          onPolygonsChanged: (polygonList = [], { action } = {}) => {
            setPolygons(createMultiPolygonFromWKTs(polygonList));
            if (action === 'DELETE') {
              setDeleteState(false);
            }
          },
          drawMode: drawActive,
          deleteMode: deleteActive
        }
      }
      AdditionalButtons={({ emitEvent, ...props }) => {
        if (!user) return null;
        return <>
          <Button look={drawActive ? 'primary' : 'ghost'} onClick={() => {
            setDrawState(!drawActive);
            setDeleteState(false);
          }}><MdDraw /></Button>
          <Button look={deleteActive ? 'primary' : 'ghost'} onClick={() => {
            setDeleteState(!deleteActive);
            setDrawState(false);
          }}><DeleteIcon /></Button>
        </>
      }}
    />
    <div ref={popupRef} css={popup} style={{ display: selectedFeatures ? 'block' : 'none' }}>
      <a ref={popupCloseRef} href="#" id="popup-closer" css={popupCloser}></a>
      {selectedFeatures && <div id="popup-content">{selectedFeatures.map(x => x.annotation).join(', ')}</div>}
    </div>
  </>
};

export default Map;


var wktFormat = new WKT();

function itemToFeature({ geometry, ...item }) {
  // Parse the WKT string using OpenLayers
  try {
    var feature = wktFormat.readFeature(geometry, {
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

function createMultiPolygonFromWKTs(wkts) {
  if (wkts.length === 0) return [];
  // create an empty array to store polygon geometries
  var polygons = [];

  // iterate through the list of WKTs
  for (var i = 0; i < wkts.length; i++) {
    // create a new polygon geometry from the WKT
    var polygon = wktFormat.readGeometry(wkts[i]);

    // check if the geometry is a polygon or multipolygon
    if (polygon instanceof Polygon) {
      // if it's a polygon, add it to the array of polygons
      polygons.push(polygon);
    } else if (polygon instanceof MultiPolygon) {
      // if it's a multipolygon, append its components to the array of polygons
      polygons = polygons.concat(polygon.getPolygons());
    } else {
      // if it's not a polygon or multipolygon, throw an error
      throw new Error('Invalid geometry type: ' + polygon.getType());
    }
  }

  // create a new multipolygon geometry from the list of polygon geometries
  var multiPolygon = new MultiPolygon(polygons);

  const polygonList = multiPolygon.getPolygons();
  if (polygonList.length === 1) {
    multiPolygon = polygonList[0];
  }

  // create a WKT format object and write the multipolygon geometry as WKT
  var wktMultiPolygon = wktFormat.writeGeometry(multiPolygon);

  // return the WKT multipolygon
  return [wktMultiPolygon];
}

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