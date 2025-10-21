// generate labels for a given field name and value pair. E.g. gadm ID to gadm name or taxoKey to scientific name

import json2str from './utils';

/*
there are 3 types of labels we might want to generate: 
enumerations that require the translation file
foreignKeys and vocabularies that require an api call
everything else is just the value as a string
*/

async function generateLabel(field, value) {
  if (!field || value === null || value === undefined) {
    return null;
  }
  if (field === 'taxonKey') {
    return getTaxonLabel(value);
  }
  if (field === 'gadm') {
    return getGadmLabel(value);
  }
  if (field === 'datasetKey') {
    return getDatasetLabel(value);
  }
  // default: return the value as string
  return String(value);
}

function getTaxonLabel(value) {
  return fetch(`https://api.gbif.org/v1/species/${value}`)
    .then((response) => response.json())
    .then((data) => {
      return data.canonicalName ?? data.scientificName;
    })
    .catch((error) => {
      console.error('Error fetching taxon key label:', error);
      return null;
    });
}

function getGadmLabel(value) {
  return fetch(`https://api.gbif.org/v1/geocode/gadm/${value}`)
    .then((response) => response.json())
    .then((data) => {
      return data.name;
    })
    .catch((error) => {
      console.error('Error fetching gadm label:', error);
      return null;
    });
}

function getDatasetLabel(value) {
  return fetch(`https://api.gbif.org/v1/dataset/${value}`)
    .then((response) => response.json())
    .then((data) => {
      return data.title;
    })
    .catch((error) => {
      console.error('Error fetching dataset label:', error);
      return null;
    });
}

// handle lists of values by fetching them one after another
async function getLabels({ field, values } = {}) {
  const labels = {};
  for (let i = 0; i < values.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const label = await generateLabel(field, values[i]);
    labels[values[i]] = label;
  }
  const result = `Labels for field ${field}:\n${json2str(labels)}`;

  return {
    content: [
      {
        type: 'text',
        text: result,
      },
    ],
  };
}

export default getLabels;
