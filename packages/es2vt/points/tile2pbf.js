var Pbf = require('pbf');

module.exports = fromVectorTileJs;

function fromVectorTileJs (tile) {
    var out = new Pbf();
    writeTile(tile, out);
    return out.finish();
}

function writeTile (tile, pbf) {
    for (var i = 0; i < tile.layers.length; i++) {
        pbf.writeMessage(3, writeLayer, tile.layers[i])
    }
}

function writeLayer (layer, pbf) {
    pbf.writeVarintField(15, layer.version || 1);
    pbf.writeStringField(1, layer.name || '');
    pbf.writeVarintField(5, layer.extent || 4096);

    var i;
    var context = {
        keys: [],
        values: [],
        keycache: {},
        valuecache: {}
    };

    for (i = 0; i < layer.features.length; i++) {
        context.feature = layer.features[i];
        pbf.writeMessage(2, writeFeature, context)
    }

    var keys = context.keys;
    for (i = 0; i < keys.length; i++) {
        pbf.writeStringField(3, keys[i])
    }

    var values = context.values;
    for (i = 0; i < values.length; i++) {
        pbf.writeMessage(4, writeValue, values[i])
    }
}

function writeFeature (context, pbf) {
    var feature = context.feature;

    //perhaps this coult be the geohash key - which is kind of the key - at least for querying
    // if (feature.id !== undefined) {
    //     pbf.writeVarintField(1, feature.id)
    // }

    pbf.writeMessage(2, writeProperties, context);
    pbf.writeVarintField(3, feature.type);
    pbf.writeMessage(4, writeGeometry, feature);
}

function writeProperties (context, pbf) {
    var feature = context.feature;
    var keys = context.keys;
    var values = context.values;
    var keycache = context.keycache;
    var valuecache = context.valuecache;

    for (var key in feature.properties) {
        var keyIndex = keycache[key];
        if (typeof keyIndex === 'undefined') {
            keys.push(key);
            keyIndex = keys.length - 1;
            keycache[key] = keyIndex;
        }
        pbf.writeVarint(keyIndex);

        var value = feature.properties[key];
        var type = typeof value;
        if (type !== 'string' && type !== 'boolean' && type !== 'number') {
            value = JSON.stringify(value);
        }
        var valueKey = type + ':' + value;
        var valueIndex = valuecache[valueKey];
        if (typeof valueIndex === 'undefined') {
            values.push(value);
            valueIndex = values.length - 1;
            valuecache[valueKey] = valueIndex;
        }
        pbf.writeVarint(valueIndex);
    }
}


function command (cmd, length) {
    return (length << 3) + (cmd & 0x7)
}

function zigzag (num) {
    return (num << 1) ^ (num >> 31)
}

function writeGeometry (feature, pbf) {
    var geometry = feature.geometry;
    var type = feature.type;
    var x = 0;
    var y = 0;
    var rings = geometry.length;
    for (var r = 0; r < rings; r++) {
        var ring = geometry[r];
        var count = 1;
        if (type === 1) {
            count = ring.length
        }
        pbf.writeVarint(command(1, count)); // moveto
        // do not write polygon closing path as lineto
        var lineCount = type === 3 ? ring.length - 1 : ring.length;
        for (var i = 0; i < lineCount; i++) {
            if (i === 1 && type !== 1) {
                pbf.writeVarint(command(2, lineCount - 1)) // lineto
            }
            var dx = ring[i].x - x;
            var dy = ring[i].y - y;
            pbf.writeVarint(zigzag(dx));
            pbf.writeVarint(zigzag(dy));
            x += dx;
            y += dy
        }
        if (type === 3) {
            pbf.writeVarint(command(7, 0)) // closepath
        }
    }
}

function writeValue (value, pbf) {
    var type = typeof value;
    if (type === 'string') {
        pbf.writeStringField(1, value)
    } else if (type === 'boolean') {
        pbf.writeBooleanField(7, value)
    } else if (type === 'number') {
        if (value % 1 !== 0) {
            pbf.writeDoubleField(3, value)
        } else if (value < 0) {
            pbf.writeSVarintField(6, value)
        } else {
            pbf.writeVarintField(5, value)
        }
    }
}