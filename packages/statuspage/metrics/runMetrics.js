const axios = require('axios');
const _ = require('lodash');
const config = require('../config');

var STATUSPAGE_API_SECRET = config.STATUSPAGE_API_SECRET;
var pageId = config.PAGE_ID;
var apiBase = config.STATUSPAGE_API_BASE;
var authHeader = { 'Authorization': 'OAuth ' + STATUSPAGE_API_SECRET };

function getMetrics(esUrl, query) {
  return axios({
    url: esUrl,
    method: 'POST',
    headers: {
      'kbn-xsrf': 'reporting',
      'User-Agent': 'gbif-statuspage'
    },
    data: query
  });
}

function updateMetrics(metricId, data) {
  var url = apiBase + '/pages/' + pageId + '/metrics/' + metricId + '/data.json';
  let options = {
    url: url,
    method: 'POST',
    data: { data },
    headers: authHeader
  };

  return axios(options);
}

function runMetrics(esUrl, query, metricId, getValue) {
  try {
    run(esUrl, query, metricId, getValue);
  } catch (err) {
    console.log(err);
    setTimeout(function () { runMetrics(esUrl, query, metricId, getValue); }, 60 * 1000);// every 1 minutes
  }
}

async function run(esUrl, query, metricId, getValue) {
  try {
    const response = await getMetrics(esUrl, query);
    const value = getValue(_.get(response, 'data', {}));
    if (value) {
      var currentTimestamp = Math.floor(new Date() / 1000);
      var data = {
        timestamp: currentTimestamp,
        value
      };
      const response = await updateMetrics(metricId, data);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setTimeout(function () { runMetrics(esUrl, query, metricId, getValue); }, 60 * 1000);// every 1 minutes
  }
}

module.exports = {
  runMetrics
}