import { useState, useEffect, useContext } from 'react';
import { ApiContext, ApiClient } from '../../dataManagement/api';
import { useQuery, } from '../../dataManagement/api';
import get from 'lodash/get';
import _ from 'lodash';

// requires a graphql endpoint running on the model
// started with 
// npx postgraphile -c 'postgresql://localhost/bgbm' --watch --enhance-graphiql --dynamic-json --show-error-stack --cors -p 7002
const customClient = new ApiClient({
  gql: {
    endpoint: 'http://labs.gbif.org:7002/graphql',
    // endpoint: 'http://localhost:7002/graphql',
  }
});

function useSpecimenData({ id }) {
  const client = useContext(ApiContext);
  const [specimen, setSpecimen] = useState();
  const { data, error, loading, load } = useQuery(SPECIMEN, { client: customClient, lazyLoad: true });

  useEffect(() => {
    if (typeof id !== 'undefined') {
      const query = {
        variables: {
          key: id
        }
      };
      load(query);
    }
  }, [id]);

  useEffect(() => {
    if (data && !loading && !error) {
      // remap data to more useful structure
      const specimenData = restructure(data);
      console.log(specimenData);
      // fetch additional data
      const cList = [];
      (async () => {

        // look up the current identification against the backbone
        const latestName = specimenData?.identifications?.current?.taxa?.[0]?.scientificName;
        if (latestName) {
          let { promise, cancel } = client.get(`https://api.gbif.org/v1/species/match2?name=${latestName}`);
          cList.push(cancel);
          const result = await promise;
          specimenData.identifications.current.taxa[0].gbif = result.data;
        }

        //get gbif interpertation of coordinates
        const { decimalLatitude, decimalLongitude, coordinateUncertaintyInMeters } = get(specimenData, 'collectionEvent.location.georeference', {});
        if (decimalLatitude) {
          let { promise: promiseGeo, cancel: cancelGeo } = client.get(`https://api.gbif.org/v1/geocode/reverse?lat=${decimalLatitude}&lng=${decimalLongitude}&uncertaintyMeters=${coordinateUncertaintyInMeters || 0}`);
          cList.push(cancelGeo);
          const resultLocation = await promiseGeo;
          specimenData.collectionEvent.location.georeference.gbif = resultLocation.data;
        }

        //get collection from grscicoll collection id
        const grSciCollId = get(specimenData, 'catalogItem.collectionByCollectionId.grscicollId');
        if (grSciCollId) {
          try {
            let { promise, cancel } = client.get(`https://api.gbif.org/v1/grscicoll/collection/${grSciCollId}`);
            cList.push(cancel);
            const result = await promise;
            specimenData.catalogItem.collection = result.data;
          } catch (e) {
            console.warn(`error fetching collection via grscicoll API: https://api.gbif.org/v1/grscicoll/collection/${grSciCollId}\n\nPerhaps the ID isn't valid?`);
          }
        }

        //update value
        setSpecimen(specimenData);
      })();

      // cancel all pending requests on unmount
      return () => {
        cList.forEach((c) => c());
      }
    }
  }, [data, loading, error]);

  return { specimen, data, error, loading, load };
}

export default useSpecimenData;

// reusable query part for event section
const eventByOccurrenceId = `
eventByOccurrenceId {
  eventId
  eventType
  eventName
  fieldNumber
  eventDate
  verbatimEventDate
  verbatimLocality
  verbatimElevation
  verbatimDepth
  verbatimCoordinates
  verbatimLatitude
  verbatimLongitude
  verbatimCoordinateSystem
  verbatimSrs
  habitat
  protocolDescription
  sampleSizeUnit
  sampleSizeValue
  eventEffort
  fieldNotes
  eventRemarks
  locationId # notice that this is different from the provided value. And that the dwc term can have meaning: https://dwc.tdwg.org/terms/#dwc:locationID
  
  locationByLocationId {
    higherGeography
    continent
    waterBody
    islandGroup
    island
    countryCode
    stateProvince
    county
    municipality
    locality
    minimumElevationInMeters
    maximumElevationInMeters
    minimumDistanceAboveSurfaceInMeters
    maximumDistanceAboveSurfaceInMeters
    minimumDepthInMeters
    maximumDepthInMeters
    verticalDatum
    locationAccordingTo
    locationRemarks
    
    georeferenceByAcceptedGeoreferenceId {
      decimalLatitude
      decimalLongitude
      geodeticDatum
      coordinateUncertaintyInMeters
      coordinatePrecision
      pointRadiusSpatialFit
      footprintWkt
      footprintSrs
      footprintSpatialFit
      georeferencedBy
      georeferencedDate
      georeferenceProtocol
      georeferenceSources
      georeferenceRemarks
      preferredSpatialRepresentation
    }
    # georeferencing history if any
    georeferencesByLocationId {
      nodes {
        georeferenceId
        georeferencedDate
      }
    }
  }
}`;

const identificationQuery = `
  identificationId
  dateIdentified
  identificationType
  verbatimIdentification
  typeStatus
  # I would have thought the people identifying would be considered agents?
  identifiedBy
  identifiedById
  identificationId
  taxonFormula
  identificationRemarks
  # I assume the plural is in case the taxon formula states it to by multiple taxa (e.g. the parka coat example)
  taxonIdentificationsByIdentificationId {
    nodes {
      taxonByTaxonId {
        taxonId
        scientificName
        taxonId
        taxonRank
        scientificNameId
        nameAccordingTo
        kingdom
        phylum
        class
        order
        family
        genus
      }
    }
  }
`;
const identificationByIdentificationId = `
  identificationByIdentificationId {
    ${identificationQuery}
  }
`;

const otherRelationships = `
  entityId
  materialEntityByMaterialEntityId {
    materialEntityType
    preparations
    disposition
    catalogNumber
    associatedSequences
    associatedReferences
  }
  digitalEntityByDigitalEntityId {
    accessUri
    format
  }
`;

const organismQuery = `
organismId
organismScope
acceptedIdentificationId
name: materialEntityByOrganismId {
  entityByMaterialEntityId {
    entityName
  }
}
`;

const SPECIMEN = `
query($key: String!) {
  # start with the preserved specimen fetched by ID (is there an occurrence ID or such that I could use?)
  specimen: allMaterialEntities(condition: {materialEntityId: $key}) {
    nodes {
      materialEntityType
      materialEntityId
      associatedSequences
      preparations
      catalogNumber
      otherCatalogNumbers
      recordedBy
      disposition
      recordNumber
      associatedReferences
      institutionCode
      collectionCode
      collectionByCollectionId {
        grscicollId
      }
      
      organism: organismByOrganismId {
        ${organismQuery}
        identificationsByOrganismId {
          nodes {
            ${identificationQuery}
          }
        }
        occurrencesByOrganismId {
          totalCount
          nodes {
            associatedTaxa
            ${eventByOccurrenceId}
          }
        }
      }

      otherRelationships: entityByMaterialEntityId {
        relationsWhereMaterialIsSubject: entityRelationshipsBySubjectEntityId {
          totalCount
          nodes {
            entityRelationshipId
            entityRelationshipType
            entityRelationshipOrder
            objectEntityIri
            entityByObjectEntityId {
              ${otherRelationships}
            }
          }
        }
        relationsWhereMaterialIsObject: entityRelationshipsByObjectEntityId {
          totalCount
          nodes {
            entityRelationshipId
            entityRelationshipType
            entityRelationshipOrder
            objectEntityIri
            entityBySubjectEntityId {
              ${otherRelationships}
            }
          }
        }
      }
      
      coreImages: entityByMaterialEntityId {
				are:entityRelationshipsByObjectEntityId(condition: {entityRelationshipType: "IMAGE OF"}) {
        	here:nodes {
          	entityRelationshipType
            entityBySubjectEntityId {
              digitalEntityByDigitalEntityId {
                digitalEntityId
                digitalEntityType
                accessUri
                format
                webStatement
                license
                rights
              }
            }
        	}
				}
        shownIn:entityRelationshipsBySubjectEntityId(condition: {entityRelationshipType: "shown in"}) {
        	here:nodes {
          	entityRelationshipType
            entityByObjectEntityId {
              digitalEntityByDigitalEntityId {
                digitalEntityId
                digitalEntityType
                accessUri
                format
                webStatement
                license
                rights
              }
            }
        	}
				}
    	}
      parts: entityByMaterialEntityId {
				are:entityRelationshipsByObjectEntityId(condition: {entityRelationshipType: "MATERIAL SAMPLE OF"}) {
        	here:nodes {
            material: entityBySubjectEntityId {
              item: materialEntityByMaterialEntityId {
                materialEntityId
                materialEntityType
                collectionCode
              }
              images: digitalEntityByDigitalEntityId {
                digitalEntityType
                accessUri
                format
                webStatement
                license
                rights
                rightsUri
                accessRights
                rightsHolder
                source
                sourceUri
                creator
                created
                modified
                language
                bibliographicCitation
              }
            }
        	}
				} 
    	}
      sequences: entityByMaterialEntityId {
        entityRelationshipsBySubjectEntityId(condition: {entityRelationshipType: "SEQUENCE OF"}) {
          nodes {
            entityRelationshipType
            entityByObjectEntityId {
              digitalEntityByDigitalEntityId {
                digitalEntityId
                digitalEntityType
                accessUri
                format
                webStatement
                license
                rights
                rightsUri
                accessRights
                rightsHolder
                source
                sourceUri
                creator
                created
                modified
                language
                bibliographicCitation

                geneticSequenceByGeneticSequenceId {
                  geneticSequenceType
                  sequence
                }
              }
            }
          }
        }
      }
      externalSequences: entityByMaterialEntityId {
        entityRelationshipsBySubjectEntityId(condition: {entityRelationshipType: "has genetic sequence"}) {
          nodes {
            entityRelationshipType
            objectEntityIri
            entityRelationshipId
          }
        }
      }
      sequencedParts: entityByMaterialEntityId {
				are:entityRelationshipsByObjectEntityId(condition: {entityRelationshipType: "MATERIAL SAMPLE OF"}) {
        	here:nodes {
            entityBySubjectEntityId {
              materialEntityByMaterialEntityId {
                materialEntityId
                catalogNumber
                preparations
              }
              sequences: entityRelationshipsBySubjectEntityId(condition: {entityRelationshipType: "SEQUENCE OF"}) {
                nodes {
                  entityRelationshipType
                  entityByObjectEntityId {
                    digitalEntityByDigitalEntityId {
                      digitalEntityId
                      digitalEntityType
                      accessUri
                      format
                      webStatement
                      license
                      rights
                      rightsUri
                      accessRights
                      rightsHolder
                      source
                      sourceUri
                      creator
                      created
                      modified
                      language
                      bibliographicCitation

                      geneticSequenceByGeneticSequenceId {
                        geneticSequenceType
                        sequence
                      }
                    }
                  }
                }
              }
            }
        	}
				} 
    	}
      chronometricAgesByMaterialEntityId {
        nodes {
          nodeId
        }
      }
      entityByMaterialEntityId {
        entityType
        entityRelationshipsByObjectEntityId {
          nodes {
            entityRelationshipType
            subjectEntityId
            entityBySubjectEntityId {
              digitalEntityByDigitalEntityId {
                geneticSequenceByGeneticSequenceId {
                  geneticSequenceType
                  sequence
                }
              }
            }
          }
        }
        entityRelationshipsBySubjectEntityId {
          nodes {
            entityRelationshipType
            entityByObjectEntityId {
              digitalEntityByDigitalEntityId {
                geneticSequenceByGeneticSequenceId {
                  geneticSequenceType
                }
              }
            }
          }
        }
        # we nede to go the the occurrence to get the location. I guess that means that you cannot publish a specimen, without creating an occurrence record?
        # there is no way to get the occurrence that is related to the collection event (in case there are more, e.g. Arctos example with blood samples from the animal for years, until it dies and is preserved)
        occurrenceEvidencesByEntityId {
          totalCount
          nodes {
            occurrenceByOccurrenceId {
              occurrenceId
              organismByOrganismId {
                ${organismQuery}
              }
              recordedBy
              recordedById
              associatedTaxa
              ${eventByOccurrenceId}
            }
          }
        }
        entityId
        # I do not really get what the name "identificationEvidences" means - it seem to be a list of identifications - I do not know what the "evidence" part refers to
        # How do I get the prefered identification?
        identificationEvidencesByEntityId {
          nodes {
            entityId
            ${identificationByIdentificationId}
          }
        }
      }
    }
  }
  catalogedItemAssertions: allAssertions(condition: {assertionTargetId: $key}) {
    nodes {
      assertionId
      assertionType
      assertionUnit
      assertionValue
      assertionValueNumeric
      assertionMadeDate
      assertionProtocol
      assertionRemarks
      assertionByAgentName
    }
  }
  identifiers: allIdentifiers(condition: {identifierTargetId: $key}) {
    nodes {
      identifierType
      identifierValue
      nodeId
    }
  }
  citations: allCitations(condition: {citationTargetId: $key}) {
    nodes {
      citationTargetType
      citationType
      referenceByCitationReferenceId {
        bibliographicCitation
        referenceIri
        referenceYear
        referenceType
      }
    }
  }
}
`;


function restructure(data) {
  const specimen = {};
  console.log(data);
  const collectionEvent = get(data, 'specimen.nodes[0].organism.occurrencesByOrganismId.nodes[0].eventByOccurrenceId') 
                          ?? get(data, 'specimen.nodes[0].entityByMaterialEntityId.occurrenceEvidencesByEntityId.nodes[0].occurrenceByOccurrenceId.eventByOccurrenceId', {});
  

  // first extract for catalogItem section
  const catalogItemSource = data?.specimen?.nodes?.[0] || {};

  const { associatedReferences, recordNumber, catalogNumber, otherCatalogNumbers, recordedBy, disposition, associatedSequences, preparations, institutionCode, collectionCode, materialEntityType, collectionByCollectionId, materialEntityId } = catalogItemSource;
  specimen.catalogItem = {
    associatedReferences, recordNumber, catalogNumber, otherCatalogNumbers, recordedBy, disposition, associatedSequences, preparations, institutionCode, collectionCode, collectionByCollectionId, materialEntityId,
    type: materialEntityType
  }

  // IDENTIFICATIONS SECTION
  // const identificationSource = data?.specimen?.nodes?.[0]?.entityByMaterialEntityId?.identificationEvidencesByEntityId?.nodes ?? [];
  const identificationsFromEvidence = _.get(data, 'specimen.nodes[0].entityByMaterialEntityId.identificationEvidencesByEntityId.nodes', []).map(x => x.identificationByIdentificationId);
  const identificationsFromOrganism = _.get(data, 'specimen.nodes[0].organism.identificationsByOrganismId.nodes', []);
  const identificationsUnion = _.unionBy(identificationsFromEvidence, identificationsFromOrganism, 'identificationId');

  let identifications = identificationsUnion.map(identification => {
    const { identificationId, dateIdentified, identificationType, identifiedBy, identifiedById, identificationRemarks, taxonFormula, verbatimIdentification, typeStatus } = identification;

    return {
      identificationId, dateIdentified, identificationType, identifiedById, identificationRemarks, taxonFormula, verbatimIdentification, typeStatus,
      identifiedBy: identifiedBy ? identifiedBy.split('|') : null,
      taxa: [// I assume it is an array in case the formula requires it
        ...identification?.taxonIdentificationsByIdentificationId?.nodes.map(x => {
          return {
            ...x.taxonByTaxonId
          }
        })
      ]
    }
  });

  const sortedIdentifications = _.sortBy(identifications, 'dateIdentified').reverse();

  specimen.identifications = {
    history: sortedIdentifications,
    current: sortedIdentifications[0], // I cannot figure out how to get this data I will just pick the latest for now}
  };

  // LOCATION SECTION
  const event = _.omitBy({
    eventId: collectionEvent.eventId,
    eventType: collectionEvent.eventType,
    eventName: collectionEvent.eventName,
    fieldNumber: collectionEvent.fieldNumber,
    eventDate: collectionEvent.eventDate,
    verbatimEventDate: collectionEvent.verbatimEventDate,
    verbatimLocality: collectionEvent.verbatimLocality,
    verbatimElevation: collectionEvent.verbatimElevation,
    verbatimDepth: collectionEvent.verbatimDepth,
    verbatimCoordinates: collectionEvent.verbatimCoordinates,
    verbatimLatitude: collectionEvent.verbatimLatitude,
    verbatimLongitude: collectionEvent.verbatimLongitude,
    verbatimCoordinateSystem: collectionEvent.verbatimCoordinateSystem,
    verbatimSrs: collectionEvent.verbatimSrs,
    habitat: collectionEvent.habitat,
    protocolDescription: collectionEvent.protocolDescription,
    sampleSizeUnit: collectionEvent.sampleSizeUnit,
    sampleSizeValue: collectionEvent.sampleSizeValue,
    eventEffort: collectionEvent.eventEffort,
    fieldNotes: collectionEvent.fieldNotes,
    eventRemarks: collectionEvent.eventRemarks,
  }, !_.isNill);
  specimen.collectionEvent = event;
  const locationSource = get(collectionEvent, 'locationByLocationId');
  const georeferenceSource = get(locationSource ?? {}, 'georeferenceByAcceptedGeoreferenceId');
  if (locationSource) {
    specimen.collectionEvent.location = {
      higherGeography: locationSource.higherGeography,
      continent: locationSource.continent,
      waterBody: locationSource.waterBody,
      islandGroup: locationSource.islandGroup,
      island: locationSource.island,
      countryCode: locationSource.countryCode,
      stateProvince: locationSource.stateProvince,
      county: locationSource.county,
      municipality: locationSource.municipality,
      locality: locationSource.locality,
      minimumElevationInMeters: locationSource.minimumElevationInMeters,
      maximumElevationInMeters: locationSource.maximumElevationInMeters,
      minimumDistanceAboveSurfaceInMeters: locationSource.minimumDistanceAboveSurfaceInMeters,
      maximumDistanceAboveSurfaceInMeters: locationSource.maximumDistanceAboveSurfaceInMeters,
      minimumDepthInMeters: locationSource.minimumDepthInMeters,
      maximumDepthInMeters: locationSource.maximumDepthInMeters,
      verticalDatum: locationSource.verticalDatum,
      locationAccordingTo: locationSource.locationAccordingTo,
      locationRemarks: locationSource.locationRemarks,
    };
  }
  if (georeferenceSource) {
    specimen.collectionEvent.location.georeference = {
      decimalLatitude: georeferenceSource.decimalLatitude,
      decimalLongitude: georeferenceSource.decimalLongitude,
      geodeticDatum: georeferenceSource.geodeticDatum,
      coordinateUncertaintyInMeters: georeferenceSource.coordinateUncertaintyInMeters,
      coordinatePrecision: georeferenceSource.coordinatePrecision,
      pointRadiusSpatialFit: georeferenceSource.pointRadiusSpatialFit,
      footprintWkt: georeferenceSource.footprintWkt,
      footprintSrs: georeferenceSource.footprintSrs,
      footprintSpatialFit: georeferenceSource.footprintSpatialFit,
      georeferencedBy: georeferenceSource.georeferencedBy,
      georeferencedDate: georeferenceSource.georeferencedDate,
      georeferenceProtocol: georeferenceSource.georeferenceProtocol,
      georeferenceSources: georeferenceSource.georeferenceSources,
      georeferenceRemarks: georeferenceSource.georeferenceRemarks,
      preferredSpatialRepresentation: georeferenceSource.preferredSpatialRepresentation,
    }
  }

  const coreImagesPart1 = get(data, 'specimen.nodes[0].coreImages.are.here', []).map(x => ({
    relation: x.entityRelationshipType,
    media: x.entityBySubjectEntityId.digitalEntityByDigitalEntityId
  }));
  const coreImagesPart2 = get(data, 'specimen.nodes[0].coreImages.shownIn.here', []).map(x => ({
    relation: x.entityRelationshipType,
    media: x.entityByObjectEntityId.digitalEntityByDigitalEntityId
  }));
  const coreImages = _.unionBy(coreImagesPart1, coreImagesPart2, 'media.digitalEntityId');
  // const partImages = get(data, 'specimen.nodes[0].parts.are.here', []);
  specimen.media = {
    images: {
      specimen: coreImages,
      parts: []
    },
    video: {},
    sound: {},
  };

  specimen.assertions = get(data, 'catalogedItemAssertions.nodes', []);

  // SEQUENCES
  const sequences = get(data, 'specimen.nodes[0].sequences.entityRelationshipsBySubjectEntityId.nodes', []);
  const partSequences = get(data, 'specimen.nodes[0].sequencedParts.are.here', []).map(x => {
    const o = x.entityBySubjectEntityId;
    return {
      material: o.materialEntityByMaterialEntityId,
      sequences: o.sequences.nodes.map(s => s.entityByObjectEntityId.digitalEntityByDigitalEntityId)
    }
  }).filter(x => x.sequences.length > 0);
  const externalSequences = get(data, 'specimen.nodes[0].externalSequences.entityRelationshipsBySubjectEntityId.nodes', []).map(x => {
    return {
      objectEntityIri: x.objectEntityIri,
      entityRelationshipId: x.entityRelationshipId,
    }
  });
  specimen.sequences = {
    material: sequences,
    parts: partSequences,
    external: externalSequences
  }

  specimen.identifiers = get(data, 'identifiers.nodes', []);
  specimen.citations = get(data, 'citations.nodes', []).map(x => x.referenceByCitationReferenceId);

  // extract organism from specimen
  const organismFromEvidence = get(data, 'specimen.nodes[0].entityByMaterialEntityId.occurrenceEvidencesByEntityId.nodes[0].occurrenceByOccurrenceId.organismByOrganismId', {});
  const organismFromMaterial = get(data, 'specimen.nodes[0].organism', {});
  const organism = organismFromMaterial || organismFromEvidence;
  specimen.organism = organism;


  // extract other relationships
  const discardedRelations = ['IMAGE OF', 'SEQUENCE OF', 'has genetic sequence', 'shown in'];
  const relationsWhereMaterialIsSubject = get(data, 'specimen.nodes[0].otherRelationships.relationsWhereMaterialIsSubject.nodes', [])
    .filter(x => !discardedRelations.includes(x.entityRelationshipType));
  const relationsWhereMaterialIsObject = get(data, 'specimen.nodes[0].otherRelationships.relationsWhereMaterialIsObject.nodes', [])
    .filter(x => !discardedRelations.includes(x.entityRelationshipType));

  const otherRelations = {relationsWhereMaterialIsSubject, relationsWhereMaterialIsObject};
  specimen.otherRelations = otherRelations;

  console.log(specimen);
  return specimen;
}
