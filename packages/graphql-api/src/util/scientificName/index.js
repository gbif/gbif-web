const ranks = require('./ranks.json');
const rankMarkerMap = require('./rankMarkerMap.json');
const FAMILY_RANK_INDEX = ranks.indexOf('FAMILY'); // 15;
const SPECIES_RANK_INDEX = ranks.indexOf('SPECIES'); // 27;


async function getParsedName(key, taxonAPI) {
    let name = await taxonAPI.getTaxonNameByKey({ key })

    if (name.type == 'OTU' ) {
        let species =  await taxonAPI.getTaxonByKey({ key })

        if (species.taxonomicStatus === 'SYNONYM') {
            return name.scientificName;
        } else {
                let parent = await taxonAPI.getTaxonByKey({ key : species.parentKey})
                return (ranks.indexOf(parent.rank) < SPECIES_RANK_INDEX) ?
                name.scientificName + ' <i>(' + parent.canonicalName + ' sp.)</i>' :
                name.scientificName + ' <i>(cf. ' + parent.canonicalName + ')</i>';
        }
        // return n;
    } else {
        // unparsable names - see https://github.com/gbif/portal-feedback/issues/209#issuecomment-307491143
        return formatName(name);
    }
}

function formatName(name) {
    let n = '';

    if (name.type == 'SCIENTIFIC' || name.type == 'CULTIVAR' || name.type == 'DOUBTFUL') {
        if (name.rankMarker && ranks.indexOf(rankMarkerMap[name.rankMarker]) > FAMILY_RANK_INDEX) {
            if ((name.genusOrAbove || name.specificEpithet) && name.scientificName.indexOf('×') === -1) {
                n += '<i>' + add(name.genusOrAbove) + add(name.specificEpithet) + '</i>';
            } else if (name.scientificName.indexOf('×') > -1 && name.canonicalNameWithMarker) {
                n += '<i>' + add(name.canonicalNameWithMarker) + '</i>';
            }


            if (name.infraSpecificEpithet && name.type !== 'CULTIVAR') {
                n += add(name.rankMarker);
            }

            if (name.infraSpecificEpithet) {
                n += '<i>' + add(name.infraSpecificEpithet) + '</i>';
            }

            if (name.infraGeneric && ranks.indexOf(rankMarkerMap[name.rankMarker]) < SPECIES_RANK_INDEX && name.type !== 'CULTIVAR') {
                n += add(name.rankMarker) + '<i>' + add(name.infraGeneric) + '</i>';
            }

            if (name.cultivarEpithet) {
                n += '\'' + name.cultivarEpithet + '\' ';
            }
        } else if (name.rankMarker === 'unranked') {
            n = name.scientificName;
            return n;
        } else {
            n += add(name.genusOrAbove);
        }
    } else if (name.type == 'HYBRID') {
        n += '<i>' + add(name.scientificName) + '</i>';
    } else if (name.type == 'CANDIDATUS') {
        let candName = name.genusOrAbove;
        if (name.specificEpithet) {
            candName += ' ' + name.specificEpithet;
        }

        n += '"<i>Candidatus </i>' + candName + '" ';
    } else if (name.type == 'INFORMAL') {
        if (ranks.indexOf(rankMarkerMap[name.rankMarker]) > FAMILY_RANK_INDEX) {
            n = '<i>' + add(name.scientificName) + '</i>';
        } else {
            n = name.scientificName;
        }
        return n;
    } else if ( name.type == 'VIRUS' || name.type == 'PLACEHOLDER') { // unparsable names - see https://github.com/gbif/portal-feedback/issues/209#issuecomment-307491143
        n = name.scientificName;
        return n;
    }

    if (name.bracketAuthorship || name.bracketYear) {
        n += '(' + addNoSpace(name.bracketAuthorship);
        if (name.bracketAuthorship && name.bracketYear) {
            n += ', ';
        }
        n += addNoSpace(name.bracketYear) + ') ';
    }
    n += addNoSpace(name.authorship);
    if (name.authorship && name.year) {
        n += ', ';
    }
    n += add(name.year);


    return n.trim();
}


function add(value) {
    return value ? value + ' ' : '';
}

function addNoSpace(value) {
    return value ? value : '';
}

module.exports.formatName = formatName;
module.exports.getParsedName = getParsedName;
