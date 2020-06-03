let LRU = require("lru-cache");
let queryCache = new LRU(1000);
let variablesCache = new LRU(10000);

module.exports = {
  queryCache: queryCache,
  variablesCache: variablesCache
}