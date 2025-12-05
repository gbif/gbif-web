
import { jsx, css } from '@emotion/react';
import React, { useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';
import { Button } from '../../../../components';
import { WKT, GeoJSON } from 'ol/format';
import turfSimplify from '@turf/simplify';
import turfBboxPolygon from '@turf/bbox-polygon';
import turfBbox from '@turf/bbox';
import turfKinks from '@turf/kinks';
import { toast } from 'react-toast';
import parseGeometry from 'wellknown';
import { ApiContext } from '../../../../dataManagement/api';
import { MdInfoOutline } from 'react-icons/md';

const wktSizeLimit = 5000;
const wktFormat = new WKT();
const geojsonFormat = new GeoJSON();

export const GeometryInput = ({ onApply, initialValue = '', ...props }) => {
  const intl = useIntl();
  const [inputValue, setValue] = useState(initialValue || '');
  const [showHelp, setShowHelp] = useState(false);
  const [offerSimplification, setSimplificationOffer] = useState(false);
  const apiClient = useContext(ApiContext);

  const messages = {
    'invalidWkt': intl.formatMessage({ id: 'filterSupport.location.invalidWkt', deaultValue: 'Invalid WKT geometry' }),
    'failedParsing': intl.formatMessage({ id: 'filterSupport.location.failedParsing', deaultValue: 'Failed to parse geometry' }),
    'onlyPolygonsSupported': intl.formatMessage({ id: 'filterSupport.location.onlyPolygonsSupported', deaultValue: 'Only polygon and multipolygon supported' }),
    'polygonSimplifiedToFewerPoints': intl.formatMessage({ id: 'filterSupport.location.polygonSimplifiedToFewerPoints', deaultValue: 'Polygon simplified to fewer points' }),
    'simplificationCausedSelfIntersection': intl.formatMessage({ id: 'filterSupport.location.simplificationCausedSelfIntersection', deaultValue: 'Simplification caused self intersection' }),
    'tooLarge': intl.formatMessage({ id: 'filterSupport.location.tooLarge', deaultValue: 'Geometry is too large' }),
    'selfIntersecting': intl.formatMessage({ id: 'filterSupport.location.selfIntersecting', deaultValue: 'Self intersecting geometry' }),
    'orderChanged': intl.formatMessage({ id: 'filterSupport.location.orderChanged', deaultValue: 'The ordering of the coordinates was reversed as it was not counter clockwise' }),
    'geometryReducedToBbox': intl.formatMessage({ id: 'filterSupport.location.geometryReducedToBbox', deaultValue: 'Geometry was reduced to its bounding box' }),
    'failedToSimplify': intl.formatMessage({ id: 'filterSupport.location.failedToSimplify', deaultValue: 'Failed to simplify geometry' }),
    'wktPlaceholder': intl.formatMessage({ id: 'filterSupport.location.wktPlaceholder', deaultValue: 'Enter WKT or GeoJSON here' }),
  };
  // if initialValue changes, then update inputValue. This could be useful if we allow the user to edit an existing geoemtry as text
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const checkWktAgainstAPI = async (wkt) => {
    const response = await apiClient
      .v1Get(`/occurrence/search`, { params: { hasCoordinate: false, geometry: wkt } }).promise;
    return response.data;
  };

  const handleAdd = (value) => {
    if (value === '') {
      return;
    }
    // check if it is a wkt or a geojson. If neither tell the user that it is invalid
    const result = parseStringToWKTs(value, messages);

    if (result.error) {
      if (result.error === 'NOT_VALID_WKT') {
        toast.error(messages.invalidWkt);
      } else if (result.error === 'FAILED_PARSING') {
        toast.error(messages.failedParsing);
      }
      return;
    }

    if (JSON.stringify(result?.geometry).length > wktSizeLimit) {
      toast.error(messages.tooLarge);
      if (result?.geometry?.length === 1) {
        setSimplificationOffer(true);
      }
      return;
    }

    if (result.selfIntersecting) {
      toast.error(messages.selfIntersecting);
      return;
    }

    if (result.orderChanged) {
      toast.warn(messages.orderChanged);
    }

    // check each geometry against the API
    // if any fail, then tell the user and offer to remove the invalid geometries
    // if all pass, then add the geometries to the list of geometries
    if (result.geometry.length > 0) {
      const promises = result.geometry.map(wkt => checkWktAgainstAPI(wkt));
      Promise.all(promises)
        .then(res => {
          onApply({ wkt: result.geometry });
          setValue('');
          setSimplificationOffer(false);
        })
        .catch(err => {
          const unknownData = err?.response?.data;
          try {
            const jsonData = JSON.parse(unknownData);
            toast.error(`The geometry was rejected by the API : ${JSON.stringify(jsonData)}`);
          } catch(parseError) {
            if (typeof unknownData === 'string' && unknownData.length > 0) {
              toast.error(`Invalid geometry: ${unknownData}`);
            } else {
              toast.error('The geometry was rejected by the API.');
            }
          }
        });
    }
  };

  const bbox = () => {
    const wkt = useBBox(inputValue, messages);
    toast.info(messages.geometryReducedToBbox);
    handleAdd(wkt);
  }

  const simplify = () => {
    const wkt = useSimplified({ str: inputValue, messages });
    if (wkt) {
      handleAdd(wkt);
      return true;
    } else {
      toast.error(messages.failedToSimplify);
      return false;
    }
  }

  return <div>
    <textarea
      css={css`
      font-size: 13px;
      resize: none;
      width: 100%;
      height: 125px;
      border: none;
      background: 0 0;
      padding: 6px;
    `}
      placeholder={messages.wktPlaceholder}
      value={inputValue}
      onChange={e => {
        setValue(e.target.value);
        setSimplificationOffer(false);
      }}
    />
    <div css={css`
    font-size: 0.85em;
    display: flex;
    > * {
      margin-inline-end: 6px;
    }
  `}>
      {offerSimplification && <Button look="primary" onClick={_ => {
        const success = simplify(inputValue);
        setSimplificationOffer(!success);
      }} css={css`margin-inline-end: 6px;`}><FormattedMessage id="filterSupport.location.simplify" /></Button>}
      {offerSimplification && <Button look="primaryOutline" onClick={_ => bbox(inputValue)} css={css`margin-inline-end: 6px;`}><FormattedMessage id="filterSupport.location.useBbox" /></Button>}
      {!offerSimplification && <Button look="primary" onClick={_ => handleAdd(inputValue)}><FormattedMessage id="filterSupport.location.add" /></Button>}
      <Button look="text" css={css`font-size: 1.5em; color: var(--primary);`} onClick={_ => setShowHelp(!showHelp)}><MdInfoOutline /></Button>
    </div>
    {(offerSimplification || showHelp) && <div css={css`background: #eee; font-size: 13px; padding: 10px; margin: 12px 0; border-radius: var(--borderRadiusPx);`}>
      {offerSimplification && <div style={{marginBottom: 8}}>
        <FormattedMessage id="filterSupport.location.simplificationWarning" />
      </div>}
      {showHelp && <FormattedMessage id="filterSupport.location.aboutWktAndGeoJson" />}
    </div>}
  </div>
};

GeometryInput.propTypes = {
  onApply: PropTypes.func,
  initialValue: PropTypes.string,
};

export const inputStyle = css`
  margin: 10px;
  z-index: 10;
  display: inline-block;
  position: relative;
  & + div {
    margin-top: 0;
    >div {
      margin-top: 0;
    }
  }
`;

function parseStringToWKTs(str, messages = {}) {
  let i, geojson, feature, isSimplified, selfIntersecting, orderChanged, wktGeom, wktGeometries = [];
  // assume geojson
  try {
    let geojsonGeometry = JSON.parse(str);
    geojson = geojsonFormat.readFeatures(geojsonGeometry);
    for (i = 0; i < geojson.length; i++) {
      feature = geojson[i].getGeometry();
      wktGeom = wktFormat.writeGeometry(feature);
      wktGeom = getRightHandCorrectedWKT(wktGeom, true);
      let parsedWkt = getAsValidWKT(wktGeom, messages);
      if (!parsedWkt.failed) {
        isSimplified = parsedWkt.isSimplified;
        orderChanged = parsedWkt.orderChanged;
        wktGeometries.push(parsedWkt.wkt);
      } else {
        return {
          error: 'NOT_VALID_WKT'
        };
      }
    }
  } catch (e) {
    // not a json object. try to parse as wkt
    try {
      let parsedWkt = getAsValidWKT(str, messages);
      if (!parsedWkt.failed) {
        isSimplified = parsedWkt.isSimplified;
        orderChanged = parsedWkt.orderChanged;
        selfIntersecting = parsedWkt.selfIntersecting,
          wktGeometries.push(parsedWkt.wkt);
      } else {
        return {
          error: 'NOT_VALID_WKT'
        };
      }
    } catch (err) {
      return {
        error: 'FAILED_PARSING'
      };
    }
  }
  return {
    geometry: wktGeometries,
    isSimplified: isSimplified,
    orderChanged: orderChanged,
    selfIntersecting: selfIntersecting
  };
}


function testWktForIntersections(str) {
  try {
    // check for kinks, if not empty then throw error
    let feature = wktFormat.readFeature(str);
    let testGeoJSon = geojsonFormat.writeFeature(feature, { rightHanded: true });
    let kinks = turfKinks(JSON.parse(testGeoJSon));
    if (kinks.features.length > 0) {
      return {
        selfIntersecting: true
      };
    }
  } catch (err) {
    return {
      error: 'FAILED_PARSING',
    };
  }
  return {
    selfIntersecting: false
  };
}

function getAsValidWKT(testWkt, messages = {}) {
  try {
    const simplifiedWkt = formatWkt(testWkt);
    const counterClockwiseWkt = getRightHandCorrectedWKT(simplifiedWkt);
    const intersectionTest = testWktForIntersections(counterClockwiseWkt);
    
    // check if invalid type 
    const isUnsupportedType = hasUnsupportedGeometryType(counterClockwiseWkt);
    if (isUnsupportedType) {
      toast.error(messages.onlyPolygonsSupported);
      return { failed: true };
    }

    return {
      failed: false,
      isSimplified: simplifiedWkt !== testWkt,
      orderChanged: counterClockwiseWkt !== simplifiedWkt,
      selfIntersecting: intersectionTest.selfIntersecting,
      wkt: counterClockwiseWkt,
    };
  } catch (err) {
    return { failed: true };
  }
}

export function isValidWKT(testWKT) {
  try {
    testWKT = formatWkt(testWKT);
    // check if invalid type 
    const isUnsupportedType = hasUnsupportedGeometryType(testWKT);
    if (isUnsupportedType) {
      return false;
    }
    let newWkt = getRightHandCorrectedWKT(testWKT);
    return testWKT === newWkt;
  } catch (err) {
    return false;
  }
}

function formatWkt(wktStr) {
  let f = wktFormat.readFeature(wktStr);
  return wktFormat.writeFeature(f, { decimals: 5 });
}

function getRightHandCorrectedWKT(wktStr) {
  let f = wktFormat.readFeature(wktStr);
  let asGeoJson = geojsonFormat.writeFeature(f, { rightHanded: true });
  let rightHandCorrectedFeature = geojsonFormat.readFeature(asGeoJson);
  let newWkt = wktFormat.writeFeature(rightHandCorrectedFeature, {
    rightHanded: true,
    decimals: 5
  });
  return newWkt;
}

function useSimplified({ str: geometryString, tolerance, messages = {} } = {}) {
  tolerance = tolerance || 0.001;
  if (typeof tolerance !== 'number') {
    throw new Error('tolerance must be a number');
  }
  var parsingResult = parseStringToWKTs(geometryString, messages);
  if (parsingResult.error) {
    return;
  }
  var geojson = parseGeometry(parsingResult.geometry[0]);
  var options = { tolerance: tolerance, highQuality: true };
  var simplified = turfSimplify(geojson, options);
  var wkt = parseGeometry.stringify(simplified);

  // test that wkt is not self intersecting. If so add a toast warning, but still use the simplified geometry
  var intersectionTest = testWktForIntersections(wkt);
  if (intersectionTest.selfIntersecting) {
    toast.warning(messages.simplificationCausedSelfIntersection);
  }
  if (wkt.length > wktSizeLimit && tolerance <= 10) {
    return useSimplified({ str: wkt, tolerance: tolerance * 4, messages });
  } else {
    toast.info(messages.polygonSimplifiedToFewerPoints);
    return wkt;
  }
};

function useBBox(str, messages = {}) {
  var parsingResult = parseStringToWKTs(str, messages);
  var geom = parseGeometry(parsingResult.geometry[0]);
  var bbox = turfBbox(geom);
  var bboxPolygon = turfBboxPolygon(bbox);
  var wkt = parseGeometry.stringify(bboxPolygon);
  return wkt;
};

function hasUnsupportedGeometryType(wkt) {
  if (typeof wkt !== 'string') {
    return true;
  }
  return flagStringWithExclusions(wkt, ['POINT', 'LINESTRING', 'MULTIPOINT', 'MULTILINESTRING', 'GEOMETRYCOLLECTION']);
}

function flagStringWithExclusions(inputString, exclusionWords) {
  // Convert the input string to lowercase for case-insensitive matching
  const lowercaseInput = inputString.toLowerCase();

  // Check if any exclusion word is present in the input string
  const foundExclusion = exclusionWords.some(word =>
      lowercaseInput.includes(word.toLowerCase())
  );

  // Return true if any exclusion word is found, indicating the string should be flagged
  return foundExclusion;
}