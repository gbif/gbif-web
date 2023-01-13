export default {
  catalogItem: {
    "associatedSequences": null,
    "preparations": null,
    "catalogNumber": "DMS-640926",
    "otherCatalogNumbers": "TF2013-640926|C-F-100309",
    "recordedBy": "Tobias Frøslev",
    "disposition": "in collection",
    "recordNumber": null,
    "associatedReferences": null,
  },// no obvious roles for clusters and parts. But could be to list other collections that also has this organism stored. POssibly Nicky's predictive approach - linking to that service?
  identifications: {
    current: {
      "dateIdentified": "2015-08-21",
      "identificationType": "VISUAL_AND_DNA",
      "verbatimIdentification": "Cortinarius koldingensis",
      "identifiedBy": "Tobias Frøslev|Thomas Stjernegaard Jeppesen",
      "identifiedById": "https://orcid.org/0000-0002-3530-013X|https://orcid.org/0000-0003-1691-239X",
      "taxonFormula": "A",
      taxa: [ // I assume it is an array in case the formula requires it
        {
          "scientificName": "Cortinarius koldingensis Frøslev & T.S.Jeppesen",
          "taxonRank": "SPECIES",
          "scientificNameId": "urn:lsid:indexfungorum.org:names:812989",
          "nameAccordingTo": "Frøslev, T.G., Jeppesen, T.S. & Dima, B. Cortinarius koldingensis—a new species of Cortinarius, subgenus Phlegmacium related to Cortinarius sulfurinus . Mycol Progress 14, 73 (2015). https://doi.org/10.1007/s11557-015-1098-z",
          interpretation: {
            gbif: {
              rank: 'SPECIES',
              classification: [
                {
                  "key": 5,
                  "rank": "KINGDOM",
                  "name": "Fungi"
                },
                {
                  "key": 34,
                  "rank": "PHYLUM",
                  "name": "Basidiomycota"
                },
                {
                  "key": 186,
                  "rank": "CLASS",
                  "name": "Agaricomycetes"
                },
                {
                  "key": 1499,
                  "rank": "ORDER",
                  "name": "Agaricales"
                },
                {
                  "key": 4172,
                  "rank": "FAMILY",
                  "name": "Cortinariaceae"
                },
                {
                  "key": 2524960,
                  "rank": "GENUS",
                  "name": "Cortinarius"
                },
                {
                  "key": 8107267,
                  "rank": "SPECIES",
                  "name": "Cortinarius koldingensis"
                }
              ]
            }
          }
        }
      ]
    },// I do not know how to get the preferred identification. I can see how to get a list including the latest, but that might not be the preffered I guess
    previous: [
      {
        "dateIdentified": "2013-10-06",
        "identificationType": "VISUAL",
        "verbatimIdentification": "Cortinarius sulphurinus var. fageticola",
        "identifiedBy": "Tobias Frøslev",
        "identifiedById": "https://orcid.org/0000-0002-3530-013X",
        "taxonFormula": "A cf.",
        taxa: [ // I assume it is an array in case the formula requires it
          {
            "scientificName": "Cortinarius sulphurinus var. fageticola Brandrud",
            "taxonRank": null,
            "scientificNameId": "urn:lsid:indexfungorum.org:names:259339",
            "nameAccordingTo": null
          }
        ]
      }
    ],
    extended: {} // this specimen is thought to be the same and has a different (newer) identification. What about parts that have been identified differently? I guess those should show as well?
  },
  sequences: {
    list: {
      core: null,
      parts: [
        {
          source: {
            type: 'PART', 
            identifier: '123'
          },
          sequence: {}
        }
      ]
    }, // including parts - caveat that sequenced parts can be of differnet organisms - e.g. a parasite
    extended: {} // this specimen is thought to be the same and has been sequenced
  },
  software: '?',
  assertions: {},// seems odd to include assertions from cluster - I imagine they wouldn't neccesarly be applicable
  organism: {},// should be the same for all I suppose, but if there were multiple, then that is a mistake I suppose and they should be made one
  occurrences: {}, // i tend to ignore anything else than the core record
  identifiers: {}, // ignore other records as well
  location: {
    core: {},
    cluster: {}// if none provided and there is a record in the cluster that have a location. Take fist location from cluster?
    // could show a map with parts and clustered records that do have a location
  },// of collecting event
  provenance: {
  },// where is this record coming from, who published it etc.
  media: {
    images: {
      specimen: [],
      parts: [],
      occurrences: [],
      cluster: [
        { source: {}, mediaItem: {} }
      ]
    },
    video: {},
    sound: {}
  },
  parts: {},// tissue etc. Could be part of other collection apparently. So does that mean they are a catalogued item for someone else? I suppose so. 
  citations: { // of this material
    declared: [],
    extended: { // this could include both literature tracking and clustered plazi records
      citationTracking: {}, //perhaps using bionomia ?
      plazi: {},
    }
  },
  agents: {},// list of distinct agents that have worked on this specimen, not including agents from cluster
  relationships: {
    parts: { // dna samples, liver, heart
      declared: {},
      extended: {} // e.g. an automatic link to a Bold record from the cluster
    },
    interactions: {}, // with other organisms
    sameAs: {} // if multiple entries are declared to be the same
  },
  clusteredRecords: {} // to show the list/graph of clustered records, but the information is also appended where relevant
}