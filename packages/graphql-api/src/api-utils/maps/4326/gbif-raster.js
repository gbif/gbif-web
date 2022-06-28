const gbifTileAttribution = require('../gbif-tile-attribution');
module.exports = {
    "version": 8,
    "name": "gbif-{{styleName}}-4326",
    "metadata": {
        "gb:reproject": true
    },
    "sources": {
        "openmaptiles": {
            "type": "raster",
            "tiles": [
                "https://tile.gbif.org/4326/omt/{z}/{x}/{y}@{{pixelRatio}}x.png?style=gbif-{{styleName}}-{{language}}"
            ],
            "attribution": gbifTileAttribution,
            "tileSize": 512,
            "projection": "EPSG:4326",
            "wrapX": true,
            "maxZoom": 18,
            "tilegridOptions": {
                "extent": [
                    -180,
                    -90,
                    180,
                    90
                ],
                "minZoom": 0,
                "maxZoom": 13,
                "resolutions": [
                    0.3515625,
                    0.17578125,
                    0.087890625,
                    0.0439453125,
                    0.02197265625,
                    0.010986328125,
                    0.0054931640625,
                    0.00274658203125,
                    0.001373291015625,
                    0.0006866455078125,
                    0.00034332275390625,
                    0.000171661376953125,
                    0.0000858306884765625,
                    0.00004291534423828125
                ],
                "tileSize": 512
            },
            "extent": [
                -180,
                -90,
                180,
                90
            ],
        }
    },
    "layers": [
        {
            "id": "background",
            "paint": {
                "background-color": "hsl(47, 26%, 88%)"
            },
            "type": "background"
        },
        {
            "id": "base-layer",
            "type": "raster",
            "source": "openmaptiles"
        }
    ],
    "id": "gbif-{{styleName}}-4326"
}