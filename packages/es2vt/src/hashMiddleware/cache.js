let LRU = require("lru-cache");
let queryCache = new LRU(10000);

module.exports = {
  queryCache: queryCache
}