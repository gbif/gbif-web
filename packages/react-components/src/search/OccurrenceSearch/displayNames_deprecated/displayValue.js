import axios from 'axios';
import formatFactory from './formatFactory';
import startCase from 'lodash/startCase';
import { rangeDisplayName } from './stdRangeDisplayName';
// TODO move endpoints to config
let endpoints = {
  dataset: 'https://api.gbif.org/v1/dataset',
  publisher: 'https://api.gbif.org/v1/organization',
  species: 'https://api.gbif.org/v1/species'
};

let displayName = [
  {
    name: 'identity',
    format: id => {
      return { title: typeof id !== 'object' ? id : JSON.stringify(id) };
    }
  },
  {
    name: 'datasetTitle',
    format: id => axios
      .get(endpoints.dataset + '/' + id)
      .then(result => ({ title: result.data.title }))
  },
  {
    name: 'publisherTitle',
    format: id => axios
      .get(endpoints.publisher + '/' + id)
      .then(result => ({ title: result.data.title }))
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
    format: id => ({ title: startCase(id + '') })
  },
  {
    name: 'TypeStatus',
    format: id => ({ title: startCase(id + '') })
  },
  // {
  //   name: 'year',
  //   format: rangeDisplayName('interval.year')
  // },
  // {
  //   name: 'elevation',
  //   format: rangeDisplayName('interval.elevation')
  // },
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

export default function (field) {
  return nameMap[field] ? nameMap[field] : nameMap.identity;
}