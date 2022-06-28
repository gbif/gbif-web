const gbifTileAttribution = require('../gbif-tile-attribution');
module.exports = {
    "version": 8,
    "name": "gbif-{{styleName}}-3857",
    "metadata": {
        "gb:reproject": false
    },
    "sources": {
        "openmaptiles": {
            "type": "raster",
            "tiles": [
                "https://tile.gbif.org/3857/omt/{z}/{x}/{y}@{{pixelRatio}}x.png?style=gbif-{{styleName}}-{{language}}"
            ],
            "projection": "EPSG:3857",
            "wrapX": true,
            "maxZoom": 17,
            "attribution": gbifTileAttribution,
            "tileSize": 512,
        }
    },
    "layers": [
        {
            "id": "background",
            "paint": {
                "background-color": "{{background}}"
            },
            "type": "background"
        },
        {
            "id": "base-layer",
            "type": "raster",
            "source": "openmaptiles"
        }
    ],
    "id": "gbif-{{styleName}}-3857"
}