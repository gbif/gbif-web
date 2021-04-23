const DownloadApi = require('./download.source');

module.exports = {
  resolver: require('./download.resolver'),
  typeDef: require('./download.type'),
  dataSource: {
    downloadAPI: DownloadApi
  }
};