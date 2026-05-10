/* eslint-disable no-param-reassign */
import world from './landmassLowRes.json';

// d3 (~80ms), jsdom (~550ms) and topojson are only needed when a globe SVG is
// actually requested. Defer to first call to keep startup cheap.
let globeDepsPromise;
const loadGlobeDeps = () => {
  if (!globeDepsPromise) {
    globeDepsPromise = Promise.all([
      import('d3'),
      import('jsdom'),
      import('topojson'),
    ]).then(([d3, jsdomMod, topojsonMod]) => ({
      select: d3.select,
      geoOrthographic: d3.geoOrthographic,
      geoPath: d3.geoPath,
      geoGraticule: d3.geoGraticule,
      JSDOM: jsdomMod.JSDOM,
      feature: topojsonMod.feature,
    }));
  }
  return globeDepsPromise;
};

const width = 100;
const height = 100;
const radius = height / 2;
const scale = radius;

function getPointGeoJson(center) {
  return [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [center.lng, center.lat],
      },
    },
  ];
}

// using the dom simulation draw a globe using d3 and return the svg as a string
function drawGlobe(
  deps,
  window,
  cb,
  { lat, lng },
  { lat: pointLat, lng: pointLng },
  {
    sphere: hasSphere = true,
    graticule: hasGraticule = true,
    land: hasLand = true,
  },
) {
  const { select, geoOrthographic, geoPath, geoGraticule, feature } = deps;
  window.d3 = select(window.document); // get d3 into the dom
  window.d3.select('body').append('div').attr('class', 'container'); // make a container div to ease the saving process

  const projection = geoOrthographic()
    .translate([width / 2, height / 2])
    .scale(scale)
    .rotate([-lng, -lat])
    .clipAngle(90);
  const path = geoPath().projection(projection);

  const svg = window.d3
    .select('.container')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', '0 0 100 100')
    .attr('preserveAspectRatio', 'none');

  // create sphere
  if (hasSphere) {
    svg
      .append('circle')
      .attr('class', 'sphere')
      .attr('cx', radius)
      .attr('cy', radius)
      .attr('r', radius);
  }

  // graticules
  if (hasGraticule) {
    const graticule = geoGraticule();
    svg
      .append('path')
      .datum(graticule)
      .attr('class', 'graticule')
      .attr('d', path);
  }

  // landmass
  if (hasLand) {
    svg
      .insert('path')
      .datum(feature(world, world.objects.land))
      .attr('class', 'land')
      .attr('d', path);
  }

  // point
  if (typeof pointLat !== 'undefined') {
    svg
      .append('path')
      .datum({
        type: 'FeatureCollection',
        features: getPointGeoJson({ lng: pointLng, lat: pointLat }),
      })
      .attr('class', 'point')
      .attr('d', path);
  }

  // strip some digits. I'm not sure what a better way is to do this is.
  return window.d3
    .select('.container')
    .html()
    .replace(/(\.\d{3})\d+/g, '$1');
}

async function getGlobeSvg({ center, point, options }) {
  const deps = await loadGlobeDeps();
  // fake dom for d3 to use
  const dom = new deps.JSDOM(`<!DOCTYPE html><body></body>`);
  return drawGlobe(deps, dom.window, 5, center, point, options);
}

export default getGlobeSvg;
