const gbifTileAttribution = require('../gbif-tile-attribution');
module.exports = {
    "version": 8,
    "name": "gbif-{{styleName}}-3031",
    "metadata": {
        "gb:reproject": true
    },
    "sources": {
        "openmaptiles": {
            "type": "raster",
            "tiles": [
                "https://tile.gbif.org/3031/omt/{z}/{x}/{y}@{{pixelRatio}}x.png?style=gbif-{{styleName}}-{{language}}"
            ],
            "projection": "EPSG:3031",
            "wrapX": false,
            "maxZoom": 14,
            "attribution": gbifTileAttribution,
            "tilegridOptions": {
                "extent": [
                    -12367396.2185,
                    -12367396.2185,
                    12367396.2185,
                    12367396.2185
                ],
                "origin": [
                    -12367396.2185,
                    12367396.2185
                ],
                "minZoom": 0,
                "maxZoom": 13,
                "resolutions": [
                    48310.14147851562,
                    24155.07073925781,
                    12077.535369628906,
                    6038.767684814453,
                    3019.3838424072264,
                    1509.6919212036132,
                    754.8459606018066,
                    377.4229803009033,
                    188.71149015045165,
                    94.35574507522583,
                    47.17787253761291,
                    23.588936268806457,
                    11.794468134403228,
                    5.897234067201614
                ],
                "tileSize": 512
            },
            "extent": [
                -12367396.2185,
                -12367396.2185,
                12367396.2185,
                12367396.2185
            ],
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
    "id": "gbif-{{styleName}}-3031"
}