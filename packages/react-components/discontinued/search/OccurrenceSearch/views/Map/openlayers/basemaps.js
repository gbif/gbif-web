import env from '../../../../../../.env.json';

export const basemaps = {
  'EPSG_4326': {
    'name': 'PLATE_CAREE',
    'url': env.BASEMAPS + '/4326/omt/{z}/{x}/{y}.pbf?',
    'srs': 'EPSG:4326'
  },
  'EPSG_3857': {
    'name': 'MERCATOR',
    'url': env.BASEMAPS + '/3857/omt/{z}/{x}/{y}.pbf?',
    'srs': 'EPSG:3857'
  },
  'EPSG_3575': {
    'name': 'ARCTIC',
    'url': env.BASEMAPS + '/3575/omt/{z}/{x}/{y}.pbf?',
    'srs': 'EPSG:3575'
  },
  'EPSG_3031': {
    'name': 'ANTARCTIC',
    'url': env.BASEMAPS + '/3031/omt/{z}/{x}/{y}.pbf?',
    'srs': 'EPSG:3031'
  }
};