/**
 * get all components. start them. check them regularly and post the results to Statuspage io.
 */

const _ = require('lodash');
const axios = require('axios');
const config = require('../config');
const refreshInterval = 60000;
const authHeader = { 'Authorization': 'OAuth ' + config.STATUSPAGE_API_SECRET };

const components = [
  {
    name: 'Dataset',
    componentId: config.COMPONENT_DATASET,
    component: require('./dataset'),
  },
  {
    name: 'Publisher',
    componentId: config.COMPONENT_ORG,
    component: require('./organization'),
  },
  {
    name: 'Installation',
    componentId: config.COMPONENT_INSTALLATION,
    component: require('./installation'),
  },
  {
    name: 'Node',
    componentId: config.COMPONENT_NODE,
    component: require('./node'),
  },
  {
    name: 'Network',
    componentId: config.COMPONENT_NETWORK,
    component: require('./network'),
  },
  {
    name: 'Collection',
    componentId: config.COMPONENT_COLLECTION,
    component: require('./collection'),
  },
  {
    name: 'Institution',
    componentId: config.COMPONENT_INSTITUTION,
    component: require('./institution'),
  },
  {
    name: 'Identity',
    componentId: config.COMPONENT_IDENTITY,
    component: require('./identity'),
  },
  {
    name: 'Species',
    componentId: config.COMPONENT_SPECIES,
    component: require('./species'),
  },
  {
    name: 'Map',
    componentId: config.COMPONENT_MAP,
    component: require('./map'),
  },
  {
    name: 'ImageCache',
    componentId: config.COMPONENT_IMAGECACHE,
    component: require('./imageCache'),
  },
  {
    name: 'Crawler',
    componentId: config.COMPONENT_CRAWLER,
    component: require('./crawler'),
  },
  {
    name: 'Website GBIF.org',
    componentId: config.COMPONENT_WEBSITE,
    component: require('./website'),
  },
  {
    name: 'Occurrence',
    componentId: config.COMPONENT_OCCURRENCE,
    component: require('./occurrence'),
  }
];

function updateStatusPage() {
  // for all components, update the statuspage
  components.forEach(c => {
    const state = c.component.getStatus();
    const formatedData = formatData(state);
    updateComponent({
      pageId: config.PAGE_ID,
      componentId: c.componentId,
      data: formatedData
    });
  });
}

function updateComponent({ pageId, componentId, data }) {
  const url = `${config.STATUSPAGE_API_BASE}/pages/${pageId}/components/${componentId}`;
  try {
    axios({
      method: 'put',
      url: url,
      headers: authHeader,
      data: data
    }).then(() => {
      // ignore response
    }).catch(error => {
      console.log(error);
    });
  } catch (err) {
    console.log(err);
  }
}

function formatData(data) {
  return {
    "component": {
      "status": data.status
    }
  }
}

function start() {
  components.forEach(c => c.component.start());
  updateStatusPage();
  setInterval(updateStatusPage, refreshInterval);
}

start();

module.exports = {}

