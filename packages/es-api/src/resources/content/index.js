const env = require('../../config');
const { config } = require('./content.config');
const { predicate2esQuery, get2predicate, get2esQuery } = require('../../requestAdapter/query');
const { suggestConfigFromAlias } = require('../../requestAdapter/util/suggestConfig');
const { get2metric, metric2aggs } = require('../../requestAdapter/aggregations');
const util = require('util');

const _ = require('lodash');

async function suggestConfig() {
  const news = await suggestConfigFromAlias({
    endpoint: env.content.hosts[0],
    alias: 'news',
    type: 'news',
  });
  const datause = await suggestConfigFromAlias({
    endpoint: env.content.hosts[0],
    alias: 'datause',
    type: 'dataUse',
  });
  const event = await suggestConfigFromAlias({
    endpoint: env.content.hosts[0],
    alias: 'event',
    type: 'event',
  });
  const project = await suggestConfigFromAlias({
    endpoint: env.content.hosts[0],
    alias: 'project',
    type: 'project',
  });
  const programme = await suggestConfigFromAlias({
    endpoint: env.content.hosts[0],
    alias: 'programme',
    type: 'programme',
  });
  const literature = await suggestConfigFromAlias({
    endpoint: env.content.hosts[0],
    alias: 'literature',
    type: 'literature',
  });
  // bring too much nonsense
  // const composition = await suggestConfigFromAlias({
  //   endpoint: env.content.hosts[0],
  //   alias: 'composition',
  //   type: 'composition'
  // });
  const help = await suggestConfigFromAlias({
    endpoint: env.content.hosts[0],
    alias: 'help',
    type: 'help',
  });
  const tool = await suggestConfigFromAlias({
    endpoint: env.content.hosts[0],
    alias: 'tool',
    type: 'tool',
  });
  const navigationelement = await suggestConfigFromAlias({
    endpoint: env.content.hosts[0],
    alias: 'navigationelement',
    type: 'navigationelement',
  });
  const organisation = await suggestConfigFromAlias({
    endpoint: env.content.hosts[0],
    alias: 'organisation',
    type: 'organisation',
  });
  const participant = await suggestConfigFromAlias({
    endpoint: env.content.hosts[0],
    alias: 'participant',
    type: 'participant',
  });
  const homepage = await suggestConfigFromAlias({
    endpoint: env.content.hosts[0],
    alias: 'homepage',
    type: 'homepage',
  });
  const call = await suggestConfigFromAlias({
    endpoint: env.content.hosts[0],
    alias: 'call',
    type: 'call',
  });
  const document = await suggestConfigFromAlias({
    endpoint: env.content.hosts[0],
    alias: 'document',
    type: 'document',
  });
  const network = await suggestConfigFromAlias({
    endpoint: env.content.hosts[0],
    alias: 'network',
    type: 'network',
  });
  const article = await suggestConfigFromAlias({
    endpoint: env.content.hosts[0],
    alias: 'article',
    type: 'article',
  });
  const notification = await suggestConfigFromAlias({
    endpoint: env.content.hosts[0],
    alias: 'notification',
    type: 'notification',
  });

  const result = _.merge(
    {},
    news,
    datause,
    event,
    project,
    programme,
    literature,
    help,
    tool,
    navigationelement,
    organisation,
    participant,
    homepage,
    call,
    document,
    network,
    article,
    notification,
  );
  // remove all keys with and underscore in them as they are typically language specific
  Object.keys(result).forEach((key) => {
    if (key.includes('_')) {
      delete result[key];
    }
  });
  console.log(util.inspect(result, { compact: false, depth: 10, sort: true }));
}

module.exports = {
  dataSource: require('./content.dataSource'),
  get2predicate: (query) => get2predicate(query, config),
  get2query: (predicate) => get2esQuery(predicate, config),
  predicate2query: (predicate, q) => predicate2esQuery(predicate, config, q),
  get2metric: (query) => get2metric(query, config),
  metric2aggs: (metrics) => metric2aggs(metrics, config),
  suggestConfig,
};

// suggestConfig().catch(err => console.log(err));
