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
            "tileSize": 512,
            "attribution": "<a href='https://www.gbif.org/citation-guidelines'>GBIF</a>",
        },
        "hillshade": {
            "type": "raster",
            "url": "https://api.maptiler.com/tiles/hillshade/tiles.json?key={{maptilerApiKey}}"
        },
        "contours": {
            "type": "vector",
            "url": "https://api.maptiler.com/tiles/contours/tiles.json?key={{maptilerApiKey}}"
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
        },
        {
            "id": "hillshade-layer",
            "type": "raster",
            "source": "hillshade",
            "paint": {
                "raster-opacity": 0.3
            }
        },
        {
            "id": "contour_index",
            "type": "line",
            "source": "contours",
            "source-layer": "contour",
            "minzoom": 10,
            "layout": {
                "visibility": "visible"
            },
            "paint": {
                "line-color": "rgba(174, 135, 77, 1)",
                "line-width": {
                    "stops": [
                        [
                            10,
                            0.8
                        ],
                        [
                            14,
                            1.3
                        ]
                    ]
                },
                "line-opacity": {
                    "stops": [
                        [
                            10,
                            0.3
                        ],
                        [
                            14,
                            0.25
                        ]
                    ]
                }
            },
            "filter": [
                "all",
                [
                    ">",
                    "height",
                    0
                ],
                [
                    "in",
                    "nth_line",
                    10,
                    5
                ]
            ]
        },
        {
            "id": "contour",
            "type": "line",
            "source": "contours",
            "source-layer": "contour",
            "minzoom": 11,
            "layout": {
                "visibility": "visible"
            },
            "paint": {
                "line-color": "rgba(174, 135, 77, 1)",
                "line-width": 0.8,
                "line-opacity": {
                    "stops": [
                        [
                            10,
                            0.2
                        ],
                        [
                            14,
                            0.2
                        ]
                    ]
                }
            },
            "filter": [
                "all",
                [
                    "!in",
                    "nth_line",
                    10,
                    5
                ],
                [
                    ">",
                    "height",
                    0
                ]
            ]
        },
    ],
    "id": "gbif-{{styleName}}-3857"
}