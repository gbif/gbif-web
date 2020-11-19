# Elastic search -> Vector tiles
Generate vector tiles from ES. Given a tile (x,y,z) and an ES filter.

* Compose a query ≈ JOIN(filter, tileBoundingBox) and 
* Aggregate per geohash and return the geo_centroid per geohash.
* This is then transformed into a vector tile.

## Requirements
Have been tested to work with
* Node v14.15.0
* ElasticSearch v6.5.4

## Development

```
npm install
npm start
```

**.env file example**
```
port: 8000

es:
  hosts: [http://your-elastic:9200]
  requestTimeout: 30000
  maxRetries: 3
  maxResultWindow: 10000
  coordinateField: coordinates # geopoint field in ES
  index: records # the name of your index -> http://your-elastic:9200/records/_search
```

## Useful links
`util/coordinateConverter.js` is the complex part and based on https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames

