/* eslint-disable no-param-reassign */
import { select, geoOrthographic, geoPath, geoGraticule } from 'd3';
import JSDOM from 'jsdom';
import { feature } from 'topojson';
import world from './landmassLowRes.json';

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

function getGlobeSvg({ center, point, options }) {
  // fake dom for d3 to use
  const dom = new JSDOM(`<!DOCTYPE html><body></body>`);
  return drawGlobe(dom.window, 5, center, point, options);
}

export default getGlobeSvg;
