

const patch = {
    TAXON_MATCH_FUZZY : {
        "relatedTerms": [
            // "http://rs.tdwg.org/dwc/terms/scientificNameAuthorship",
            // "http://rs.tdwg.org/dwc/terms/kingdom",
            // "http://rs.tdwg.org/dwc/terms/genus",
            // "http://rs.tdwg.org/dwc/terms/class",
            // "http://rs.tdwg.org/dwc/terms/infraspecificEpithet",
            // "http://rs.tdwg.org/dwc/terms/family",
            // "http://rs.gbif.org/terms/1.0/genericName",
            // "http://rs.tdwg.org/dwc/terms/order",
            // "http://rs.tdwg.org/dwc/terms/specificEpithet",
            "http://rs.tdwg.org/dwc/terms/scientificName",
            // "http://rs.tdwg.org/dwc/terms/phylum"
          ]
    },
    TAXON_MATCH_HIGHERRANK : {
        "relatedTerms": [
          // "http://rs.tdwg.org/dwc/terms/scientificNameAuthorship",
          // "http://rs.tdwg.org/dwc/terms/kingdom",
          // "http://rs.tdwg.org/dwc/terms/genus",
          // "http://rs.tdwg.org/dwc/terms/class",
          // "http://rs.tdwg.org/dwc/terms/infraspecificEpithet",
          // "http://rs.tdwg.org/dwc/terms/family",
          // "http://rs.gbif.org/terms/1.0/genericName",
          // "http://rs.tdwg.org/dwc/terms/order",
          // "http://rs.tdwg.org/dwc/terms/specificEpithet",
          "http://rs.tdwg.org/dwc/terms/scientificName",
          // "http://rs.tdwg.org/dwc/terms/phylum"
        ]
      }

}
// const getPatchedData = interpretationRemark => interpretationRemark.map(i => patch[i.id] ? {...i, ...patch[i.id]} : i);
const getPatchedData = interpretationRemark => interpretationRemark.map(i => patch[i.id] ? {...i, ...patch[i.id]} : i);
module.exports = {
    getPatchedData
}