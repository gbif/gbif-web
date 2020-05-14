import axios from '../api/axios';
import formatFactory from './formatFactory';
import startCase from 'lodash/startCase';
import isUndefined from 'lodash/isUndefined';

// TODO move endpoints to config
let endpoints = {
  dataset: 'https://api.gbif.org/v1/dataset',
  publisher: 'https://api.gbif.org/v1/dataset',
  species: 'https://api.gbif.org/v1/species'
};

let displayName = [
  {
    name: 'identity',
    format: id => {
      return {title: typeof id !== 'object' ? id : JSON.stringify(id)};
    }
  },
  {
    name: 'datasetTitle',
    format: id => axios
        .get(endpoints.dataset + '/' + id)
        .then(result => ({title: result.data.title}))
  },
  {
    name: 'publisherKey',
    format: id => axios
        .get(endpoints.publisher + '/' + id)
        .then(result => ({title: result.data.title}))
  },
  {
    name: 'TaxonKey',
    format: id => axios
        .get(endpoints.species + '/' + id)
        .then(result => ({ title: result.data.scientificName }))
  },
  {
    name: 'scientificName',
    format: id => axios
        .get(endpoints.species + '/' + id)
        .then(result => ({ title: result.data.scientificName }))
  },
  {
    name: 'canonicalName',
    format: id => axios
        .get(endpoints.species + '/' + id)
        .then(result => ({ title: result.data.canonicalName }))
  },
  {
    name: 'BasisOfRecord',
    format: id => ({title: startCase(id + '')})
  },
  {
    name: 'TypeStatus',
    format: id => ({title: startCase(id + '')})
  },
  {
    name: 'year',
    format: id => {
      if (typeof id === 'object') {
        let title;
        if (isUndefined(id.gte)) {
          title = `before ${id.lt}`;  
        } else if(isUndefined(id.lt)) {
          title = `after ${id.gte}`;  
        } else if(id.gte === id.lt) {
          title = id.gte;
        } else {
          title = `${id.gte} - ${id.lt}`;
        }
        return {
          title: title,
          description: 'from (incl) - to (excl)'
        }
      }
      return {title: id};
    }
  },
];

function getAsComponents(fns) {
  let displayNamesMap = {};
  fns.forEach(x => {
    displayNamesMap[x.name] = {
      format: x.format,
      component: formatFactory(x.format)
    }
  });
  return displayNamesMap;
}

let nameMap = getAsComponents(displayName);

export default function(field) {
  return nameMap[field] ? nameMap[field] : nameMap.identity;
}