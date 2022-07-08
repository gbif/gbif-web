// const elasticsearch = require('elasticsearch');
const { Client } = require('@elastic/elasticsearch');
const Agent = require('agentkeepalive');
const { searchMvt } = require('../esRequest');
const env = require('../../config');

const searchIndex = env.event.index || 'event';

// this isn't an ideal solution, but we keep changing between using an http and https agent. vonfig should require code change as well
const isHttpsEndpoint = env.event.hosts[0].startsWith('https');
const AgentType = isHttpsEndpoint ? Agent.HttpsAgent : Agent;

const agent = () => new AgentType({
  maxSockets: 1000, // Default = Infinity
  keepAlive: true
});

const client = new Client({
  nodes: env.event.hosts,
  maxRetries: env.event.maxRetries || 3,
  requestTimeout: env.event.requestTimeout || 60000,
  agent,
  auth: {
    username: env.event.username,
    password: env.event.password
  }
});

async function queryMvt({ query: body, tileParams }) {
  const { 
    aggs, 
    exact_bounds, 
    extent, fields, 
    grid_precision, 
    grid_type = 'points', 
    query, 
    runtime_mappings, 
    size = 0, 
    sort, 
    track_total_hits = false
  } = body;
  let filter = [
    {
      "term": {
        "type": "event"
      }
    }
  ];
  if (query) filter.push(query);
  const esBody = {
    track_total_hits,
    size,
    grid_type,
    query: {
      bool: {
        filter
      }
    }
  }

  let tile = await searchMvt({
    client: client,
    index: searchIndex,
    body: esBody,
    field: 'event.coordinates', //FIXME should this passed as part of the request
    ...tileParams
  });
  return tile;
}

module.exports = {
  queryMvt
};