/**
 * Given an elastic search query string query, then add a filter for a given tile. 
 * returns either the build query or the bodybuilder instance.
 */
const coordinateConverter = require('../util/coordinateConverter');

function esTileQuery(x, y, z, userQuery, locationField) {
  if (typeof (userQuery) === 'string') {
    userQuery = {
      "query_string": {
        "query": userQuery
      }
    }
  }
  // set defaults
  locationField = locationField || 'location';

  // get bounding box from tile coordinates
  const bb = coordinateConverter.tile2boundingBox(x, y, z);
  // compose an ES filter
  let tileQuery = {
    geo_bounding_box: {
    }
  };
  tileQuery.geo_bounding_box[locationField] = {
    "top": bb.north,
    "left": bb.west,
    "bottom": bb.south,
    "right": bb.east
  };

  // compose filter. simply nest the user query. Unclear if this is bad for performance. It could be flattened in most cases. But this is simple to do.
  let filter = [];
  if (userQuery) {
    filter.push(userQuery)
  }
  filter.push(tileQuery);

  return {
    bool: { filter: filter }
  };
}

module.exports = esTileQuery;