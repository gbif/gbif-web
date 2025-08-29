import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import turfBbox from '@turf/bbox';
import turfBboxPolygon from '@turf/bbox-polygon';
import turfKinks from '@turf/kinks';
import turfSimplify from '@turf/simplify';
import { GeoJSON, WKT } from 'ol/format';
import { useEffect, useState } from 'react';
import { MdInfoOutline } from 'react-icons/md';
import { FormattedMessage, useIntl } from 'react-intl';
import parseGeometry from 'wellknown';

const wktSizeLimit = 5000;
const wktFormat = new WKT();
const geojsonFormat = new GeoJSON();

interface GeometryInputProps {
  onApply?(...args: unknown[]): unknown;
  initialValue?: string;
  onAdd(...args: unknown[]): unknown;
}

export const GeometryInput = ({ onAdd, initialValue = '' }: GeometryInputProps) => {
  const { toast } = useToast();
  const intl = useIntl();
  const [inputValue, setValue] = useState(initialValue || '');
  const [showHelp, setShowHelp] = useState(false);
  const [offerSimplification, setSimplificationOffer] = useState(false);

  const messages = {
    invalidWkt: intl.formatMessage({
      id: 'filterSupport.location.invalidWkt',
      defaultMessage: 'Invalid WKT geometry',
    }),
    failedParsing: intl.formatMessage({
      id: 'filterSupport.location.failedParsing',
      defaultMessage: 'Failed to parse geometry',
    }),
    onlyPolygonsSupported: intl.formatMessage({
      id: 'filterSupport.location.onlyPolygonsSupported',
      defaultMessage: 'Only polygon and multipolygon supported',
    }),
    polygonSimplifiedToFewerPoints: intl.formatMessage({
      id: 'filterSupport.location.polygonSimplifiedToFewerPoints',
      defaultMessage: 'Polygon simplified to fewer points',
    }),
    simplificationCausedSelfIntersection: intl.formatMessage({
      id: 'filterSupport.location.simplificationCausedSelfIntersection',
      defaultMessage: 'Simplification caused self intersection',
    }),
    tooLarge: intl.formatMessage({
      id: 'filterSupport.location.tooLarge',
      defaultMessage: 'Geometry is too large',
    }),
    selfIntersecting: intl.formatMessage({
      id: 'filterSupport.location.selfIntersecting',
      defaultMessage: 'Self intersecting geometry',
    }),
    orderChanged: intl.formatMessage({
      id: 'filterSupport.location.orderChanged',
      defaultMessage:
        'The ordering of the coordinates was reversed as it was not counter clockwise',
    }),
    geometryReducedToBbox: intl.formatMessage({
      id: 'filterSupport.location.geometryReducedToBbox',
      defaultMessage: 'Geometry was reduced to its bounding box',
    }),
    failedToSimplify: intl.formatMessage({
      id: 'filterSupport.location.failedToSimplify',
      defaultMessage: 'Failed to simplify geometry',
    }),
    wktPlaceholder: intl.formatMessage({
      id: 'filterSupport.location.wktPlaceholder',
      defaultMessage: 'Enter WKT or GeoJSON here',
    }),
  };
  // if initialValue changes, then update inputValue. This could be useful if we allow the user to edit an existing geoemtry as text
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const checkWktAgainstAPI = async (wkt: string) => {
    const response = await fetch(
      `${import.meta.env.PUBLIC_API_V1}/occurrence/search?hasCoordinate=false&geometry=${wkt}`
    ).then((res) => res.json());
    return response.data;
  };

  const handleAdd = (value: string) => {
    if (value === '') {
      return;
    }
    // check if it is a wkt or a geojson. If neither tell the user that it is invalid
    const result = parseStringToWKTs(value, messages);

    if (result.error) {
      if (result.error === 'NOT_VALID_WKT') {
        toast({
          title: messages.invalidWkt,
          variant: 'destructive',
        });
      } else if (result.error === 'FAILED_PARSING') {
        toast({
          title: messages.failedParsing,
          variant: 'destructive',
        });
      }
      return;
    }

    if (JSON.stringify(result?.geometry).length > wktSizeLimit) {
      toast({
        title: messages.tooLarge,
        variant: 'destructive',
      });
      if (result?.geometry?.length === 1) {
        setSimplificationOffer(true);
      }
      return;
    }

    if (result.selfIntersecting) {
      toast({
        title: messages.selfIntersecting,
        variant: 'destructive',
      });
      return;
    }

    if (result.orderChanged) {
      toast({
        title: messages.orderChanged,
        variant: 'default', // more of a warning, than an error but that isn't an option in the current API
      });
    }

    // check each geometry against the API
    // if any fail, then tell the user and offer to remove the invalid geometries
    // if all pass, then add the geometries to the list of geometries
    if (result.geometry && result.geometry.length > 0) {
      const promises = result.geometry
        .filter((x) => typeof x !== 'undefined')
        .map((wkt) => checkWktAgainstAPI(wkt));
      Promise.all(promises)
        .then(() => {
          onAdd({ wkt: result.geometry.filter((x) => typeof x !== 'undefined') });
          setValue('');
          setSimplificationOffer(false);
        })
        .catch((err) => {
          const unknownData = err?.response?.data;
          try {
            const jsonData = JSON.parse(unknownData);
            toast({
              title: `The geometry was rejected by the API : ${JSON.stringify(jsonData)}`,
              variant: 'destructive',
            });
          } catch (parseError) {
            if (typeof unknownData === 'string' && unknownData.length > 0) {
              toast({
                title: `Invalid geometry: ${unknownData}`,
                variant: 'destructive',
              });
            } else {
              toast({
                title: 'The geometry was rejected by the API.',
                variant: 'destructive',
              });
            }
          }
        });
    }
  };

  const bbox = () => {
    const wkt = getBBox(inputValue, messages);
    toast({
      title: messages.geometryReducedToBbox,
      variant: 'destructive',
    });
    handleAdd(wkt);
  };

  const simplify = () => {
    const wkt = getSimplified({ str: inputValue, messages, toast });
    if (wkt) {
      handleAdd(wkt);
      return true;
    } else {
      toast({
        title: messages.failedToSimplify,
        variant: 'destructive',
      });
      return false;
    }
  };

  return (
    <div>
      <textarea
        className="g-text-sm g-resize-none g-w-full g-h-32 g-border-none g-bg-transparent g-p-2"
        placeholder={messages.wktPlaceholder}
        value={inputValue}
        onChange={(e) => {
          setValue(e.target.value);
          setSimplificationOffer(false);
        }}
      />
      <div className="g-text-sm g-flex g-m-2">
        {offerSimplification && (
          <Button
            size="sm"
            variant="default"
            onClick={() => {
              const success = simplify(inputValue);
              setSimplificationOffer(!success);
            }}
            className="g-me-2"
          >
            <FormattedMessage id="filterSupport.location.simplify" />
          </Button>
        )}
        {offerSimplification && (
          <Button
            size="sm"
            variant="primaryOutline"
            onClick={() => bbox(inputValue)}
            className="g-me-2"
          >
            <FormattedMessage id="filterSupport.location.useBbox" />
          </Button>
        )}
        {!offerSimplification && (
          <Button
            size="sm"
            className="g-me-2"
            variant="default"
            onClick={() => handleAdd(inputValue)}
          >
            <FormattedMessage id="filterSupport.add" />
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          className="g-me-2 g-text-base g-text-primary-500"
          onClick={() => setShowHelp(!showHelp)}
        >
          <MdInfoOutline />
        </Button>
      </div>
      {(offerSimplification || showHelp) && (
        <div className="g-text-xs g-bg-gray-100 g-p-2 g-my-2 g-rounded-md">
          {offerSimplification && (
            <div className="g-mb-2">
              <FormattedMessage id="filterSupport.location.simplificationWarning" />
            </div>
          )}
          {showHelp && <FormattedMessage id="filterSupport.location.aboutWktAndGeoJson" />}
        </div>
      )}
    </div>
  );
};

function parseStringToWKTs(str: string, messages = {}) {
  let i, geojson, feature, isSimplified, selfIntersecting, orderChanged, wktGeom;
  const wktGeometries = [];
  // assume geojson
  try {
    const geojsonGeometry = JSON.parse(str);
    geojson = geojsonFormat.readFeatures(geojsonGeometry);
    for (i = 0; i < geojson.length; i++) {
      feature = geojson[i].getGeometry();
      wktGeom = wktFormat.writeGeometry(feature);
      wktGeom = getRightHandCorrectedWKT(wktGeom);
      const parsedWkt = getAsValidWKT(wktGeom, messages);
      if (!parsedWkt.failed) {
        isSimplified = parsedWkt.isSimplified;
        orderChanged = parsedWkt.orderChanged;
        wktGeometries.push(parsedWkt.wkt);
      } else {
        return {
          error: 'NOT_VALID_WKT',
        };
      }
    }
  } catch (e) {
    // not a json object. try to parse as wkt
    try {
      const parsedWkt = getAsValidWKT(str, messages);
      if (!parsedWkt.failed) {
        isSimplified = parsedWkt.isSimplified;
        orderChanged = parsedWkt.orderChanged;
        (selfIntersecting = parsedWkt.selfIntersecting), wktGeometries.push(parsedWkt.wkt);
      } else {
        return {
          error: 'NOT_VALID_WKT',
        };
      }
    } catch (err) {
      return {
        error: 'FAILED_PARSING',
      };
    }
  }
  return {
    geometry: wktGeometries,
    isSimplified: isSimplified,
    orderChanged: orderChanged,
    selfIntersecting: selfIntersecting,
  };
}

function testWktForIntersections(str: string) {
  try {
    // check for kinks, if not empty then throw error
    const feature = wktFormat.readFeature(str);
    const testGeoJSon = geojsonFormat.writeFeature(feature, { rightHanded: true });
    const kinks = turfKinks(JSON.parse(testGeoJSon));
    if (kinks.features.length > 0) {
      return {
        selfIntersecting: true,
      };
    }
  } catch (err) {
    return {
      error: 'FAILED_PARSING',
    };
  }
  return {
    selfIntersecting: false,
  };
}

function getAsValidWKT(testWkt: string, messages = {}, toast: Toast) {
  try {
    const simplifiedWkt = formatWkt(testWkt);
    const counterClockwiseWkt = getRightHandCorrectedWKT(simplifiedWkt);
    const intersectionTest = testWktForIntersections(counterClockwiseWkt);

    // check if invalid type
    const isUnsupportedType = hasUnsupportedGeometryType(counterClockwiseWkt);
    if (isUnsupportedType) {
      toast({
        title: messages?.onlyPolygonsSupported,
        variant: 'destructive',
      });
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

export function isValidWKT(testWKT: string) {
  try {
    testWKT = formatWkt(testWKT);
    // check if invalid type
    const isUnsupportedType = hasUnsupportedGeometryType(testWKT);
    if (isUnsupportedType) {
      return false;
    }
    const newWkt = getRightHandCorrectedWKT(testWKT);
    return testWKT === newWkt;
  } catch (err) {
    return false;
  }
}

function formatWkt(wktStr: string) {
  const f = wktFormat.readFeature(wktStr);
  return wktFormat.writeFeature(f, { decimals: 5 });
}

function getRightHandCorrectedWKT(wktStr: string) {
  const f = wktFormat.readFeature(wktStr);
  const asGeoJson = geojsonFormat.writeFeature(f, { rightHanded: true });
  const rightHandCorrectedFeature = geojsonFormat.readFeature(asGeoJson);
  const newWkt = wktFormat.writeFeature(rightHandCorrectedFeature, {
    rightHanded: true,
    decimals: 5,
  });
  return newWkt;
}

function getSimplified({
  str: geometryString,
  tolerance,
  messages = {},
  toast,
}: {
  str: string;
  tolerance?: number;
  messages: Record<string, string>;
  toast: Toast;
}) {
  tolerance = tolerance || 0.001;
  if (typeof tolerance !== 'number') {
    throw new Error('tolerance must be a number');
  }
  const parsingResult = parseStringToWKTs(geometryString, messages);
  if (parsingResult.error) {
    return;
  }
  const geojson = parseGeometry.parse(parsingResult?.geometry?.[0]);
  const options = { tolerance: tolerance, highQuality: true };
  const simplified = turfSimplify(geojson, options);
  const wkt = parseGeometry.stringify(simplified);

  // test that wkt is not self intersecting. If so add a toast warning, but still use the simplified geometry
  const intersectionTest = testWktForIntersections(wkt);
  if (intersectionTest.selfIntersecting) {
    toast({
      title: messages?.simplificationCausedSelfIntersection,
      variant: 'destructive',
    });
  }
  if (wkt.length > wktSizeLimit && tolerance <= 10) {
    return getSimplified({ str: wkt, tolerance: tolerance * 4, messages, toast });
  } else {
    toast({
      title: messages?.polygonSimplifiedToFewerPoints,
      variant: 'destructive',
    });
    return wkt;
  }
}

function getBBox(str: string, messages = {}) {
  const parsingResult = parseStringToWKTs(str, messages);
  const geom = parseGeometry.parse(parsingResult.geometry[0]);
  const bbox = turfBbox(geom);
  const bboxPolygon = turfBboxPolygon(bbox);
  const wkt = parseGeometry.stringify(bboxPolygon);
  return wkt;
}

function hasUnsupportedGeometryType(wkt: string) {
  if (typeof wkt !== 'string') {
    return true;
  }
  return flagStringWithExclusions(wkt, [
    'POINT',
    'LINESTRING',
    'MULTIPOINT',
    'MULTILINESTRING',
    'GEOMETRYCOLLECTION',
  ]);
}

function flagStringWithExclusions(inputString: string, exclusionWords: string[]) {
  // Convert the input string to lowercase for case-insensitive matching
  const lowercaseInput = inputString.toLowerCase();

  // Check if any exclusion word is present in the input string
  const foundExclusion = exclusionWords.some((word) => lowercaseInput.includes(word.toLowerCase()));

  // Return true if any exclusion word is found, indicating the string should be flagged
  return foundExclusion;
}
