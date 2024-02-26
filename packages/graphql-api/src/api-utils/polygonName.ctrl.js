/*
Experimental endpoint to provide a human readable form for WKT polygons.
The idea is to use our geocoding layers to provide results like: denmark, copenhagen area, gentofte and dragør.
*/
import wellknown from 'wellknown';
import { bbox, polygon, booleanPointInPolygon } from '@turf/turf';
import axios from 'axios';
import { uniq } from 'lodash';
import { Router } from 'express';
import config from '../config';

const router = Router();

export default (app) => {
  app.use('/unstable-api', router);
};

router.get('/polygon-name', async (req, res, next) => {
  const wkt = req.query.wkt;
  const result = await getPolygonName(wkt);
  return res.json({
    title: uniq(result.map(item => item.title)).join(', '),
  });
});

async function getPolygonName(wkt) {
  // Step 1: Parse WKT Geometry
  const geometry = wellknown.parse(wkt);

  // Step 2: Get Bounding Box
  const boundingBox = bbox(polygon([geometry.coordinates[0]]));

  // Step 3: Generate 5x5 Grid of Points
  const gridSize = 5;
  function getGridPoints(boundingBox, gridSize) {
    const stepX = (boundingBox[2] - boundingBox[0]) / gridSize;
    const stepY = (boundingBox[3] - boundingBox[1]) / gridSize;

    const gridPoints = [];

    // Include initial WKT points
    for (const coord of geometry.coordinates[0]) {
      gridPoints.push({ lat: coord[1], lng: coord[0] });
    }

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const x = boundingBox[0] + i * stepX;
        const y = boundingBox[1] + j * stepY;

        // Check if the point is inside the original polygon
        if (booleanPointInPolygon([x, y], polygon([geometry.coordinates[0]]))) {
          gridPoints.push({ lat: y, lng: x });
        }
      }
    }

    return gridPoints;
  }

  let gridPoints = getGridPoints(boundingBox, gridSize);
  if (gridPoints.length < 15) {
    gridPoints = getGridPoints(boundingBox, 10);
  }


  // Step 4: Perform Reverse Geocoding for Each Grid Point
  const metadataList = [];

  const sortedMetadata = await (async () => {
    for (const point of gridPoints) {
      const metadata = await reverseGeocodeGetMetadata(point.lat, point.lng);
      if (metadata !== null) {
        metadataList.push(...metadata);
      }
    }

    // Convert the list to an array of objects and sort by frequency
    const sortedMetadata = sortMetadataByFrequency(metadataList);
    return sortedMetadata;
  })();

  return sortedMetadata;
}

// Function to sort metadata by frequency
function sortMetadataByFrequency(metadataList) {
  const metadataCountMap = new Map();

  for (const metadata of metadataList) {
    const key = JSON.stringify(metadata); // Convert to JSON string for using as a key
    metadataCountMap.set(key, (metadataCountMap.get(key) || 0) + 1);
  }

  // Convert the map to an array of objects and sort by count
  // it would be nice to sort by, count, then size/relevance (continent, country(GADM0), marine area, GADM1, GADM2, GADM3, other, )
  const sortedMetadata = Array.from(metadataCountMap)
    .map(([key, count]) => {
      const metadata = JSON.parse(key);
      if (metadata.source === 'https://www.marineregions.org/') {
        metadata.title = metadata.title + ' (Marine Regions)';
      }
      return { title: metadata.title, frequency: count };
    }).sort((a, b) => b.frequency - a.frequency);
  return sortedMetadata;
}


// Function to perform reverse geocoding using GBIF API
async function reverseGeocodeGetMetadata(lat, lon, uncertaintyDegrees = 0) {
  const apiUrl = `${config.apiv1}/geocode/reverse?lat=${lat}&lng=${lon}&uncertaintyDegrees=${uncertaintyDegrees}`;

  try {
    const response = await axios.get(apiUrl);
    const metadata = response.data
      .filter(item => item.distance <= uncertaintyDegrees)
      .filter(item => item.source !== 'https://www.marineregions.org/')// the problem is that there is always a result, even for inland areas
      .filter(item => item.type !== 'Continent')// but i guess we should just translate continent and country

    return metadata;
  } catch (error) {
    console.error('Error in reverse geocoding:', error.message);
    return null;
  }
}
