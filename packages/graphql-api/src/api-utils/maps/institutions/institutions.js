// using axios page through all institutions from the gbif API, given a filter
// and concatenate the results into a single array
import axios from 'axios';
import config from '../../../config';
import queryString from 'query-string';

let allInstitutions = [];

export const getInstitutions = async ({limit: size, offset: from, ...filter} = {}, req) => {
  const limit = Number.parseInt(size) || 300;
  let offset = Number.parseInt(from) || 0;
  let institutions = [];
  let total = 0;

  do {
    const params = {
      limit,
      offset,
      hasCoordinate: true, // this filter doesn't exist in the API, but it should for this to work well
      ...filter,
    };
    let response;

		// In some instances, this API call returns 503 and crashes the graphql-api package.
		// Wrap in a try-catch to handle it
		try  {
			response = await axios.get(`${config.apiv1}/grscicoll/institution`, {
				params: params,
				paramsSerializer: function (params) {
					return queryString.stringify(params, { arrayFormat: 'repeat' })
				},
			});
		} catch (error) {
			console.error(error);
			return null;
		}

    // prune response to only include a subset of the fields, to reduce the size of the response
    // the fields are latitude, longitude, code, name, key, active, numberSpecimens
    response.data.results = response.data.results.map((institution) => {
      return {
        latitude: institution.latitude,
        longitude: institution.longitude,
        name: institution.name,
        key: institution.key,
        numberSpecimens: institution.numberSpecimens,
        active: institution.active,
        displayOnNHCPortal: institution.displayOnNHCPortal
      }
    });

    institutions = institutions.concat(response.data.results);
    total = response.data.count;
    offset += limit;

    // cancel loop if request is closed
    if (req && req.aborted) {
      return null;
    }
  } while (offset < total && !size);

  return institutions;
}

// get institutions as geojson
export const getInstitutionsGeojson = async (filter, req, refreshCache) => {
  // if refreshCache, then return cached results, but trigger a new request in the background and update the cached resonse to next request
  if (refreshCache) {
    getInstitutions(filter, req).then((institutions) => {
      allInstitutions = institutions;
    });
  }

  let institutions = allInstitutions;
  
  // if no filter or a filter by "active" or by "displayOnNHCPortal", then use cached institutions, but filtered by active or displayOnNHCPortal
  // if any other filters is used, then trigger a request to the API
  if (institutions?.length > 0 && onlyContainsValidKeys(filter, ['active', 'displayOnNHCPortal'])) {
    // parse filter.active to boolean
    const active = filter.active === 'true';
    institutions = institutions.filter((institution) => {
      if (filter.active) {
        return institution.active === active;
      }
      return true;
    });

    // parse filter.displayOnNHCPortal to boolean
    const displayOnNHCPortal = filter.displayOnNHCPortal === 'true';
    institutions = institutions.filter((institution) => {
      if (filter.displayOnNHCPortal) {
        return institution.displayOnNHCPortal === displayOnNHCPortal;
      }
      return true;
    });
  } else {
    institutions = await getInstitutions(filter, req) || [];
  }
  
  // remove institutiuons without coordinates
  institutions = institutions.filter((institution) => {
    return institution.latitude && institution.longitude;
  });

  const geojson = {
    type: 'FeatureCollection',
    features: institutions.map((institution) => {
      const {latitude, longitude, ...properties} = institution;
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        properties: {
          name: properties.name,
          key: properties.key,
        }
      }
    })
  }

  return geojson;
}

// trigger at sartup to update the cached institutions
getInstitutionsGeojson({}, null, true);
// update the cahced institutions every 30 minutes
setInterval(() => {
  getInstitutionsGeojson({}, null, true);
}, 1000 * 60 * 30);


// given an object, decide if it only contains any keys that aren't in a fixed list of keys. If so return false.
function onlyContainsValidKeys(object, validKeys) {
  return Object.keys(object).every((key) => {
    return validKeys.includes(key);
  });
}
