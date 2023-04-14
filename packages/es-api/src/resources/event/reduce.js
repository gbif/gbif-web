const _ = require('lodash');

function removeUndefined(obj) {
  for (let k in obj) if (obj[k] === undefined) delete obj[k];
  return obj;
}

/**
 * Map ES response to something similar to v1
 */
function reduce(item) {
  const source = item._source;
  const { event } = source;

  // Handle seedbank extension
  let seedbankRecord;
  const seedbankExtension = source.verbatim.extensions?.['http://replace-me/terms/seedbankextension'];

  // Ensure the seed bank extension exists before mapping the verbatim values
  if (seedbankExtension) {
    const [seedbankVerbatim] = seedbankExtension;
    seedbankRecord = removeUndefined({
      id:                               event.seedbankRecord?.id,
      eventID:                          seedbankVerbatim['http://rs.tdwg.org/dwc/terms/eventID'],
      degreeOfEstablishment:            seedbankVerbatim['http://rs.tdwg.org/dwc/terms/degreeOfEstablishment'],
      accessionNumber:                  seedbankVerbatim['http://REPLACE-ME/terms/accessionNumber'],
      seedPerGram:                      event.seedbankRecord?.seedPerGram,
      formInStorage:                    seedbankVerbatim['http://REPLACE-ME/terms/formInStorage'],
      sampleWeightInGrams:              event.seedbankRecord?.sampleWeightInGrams,
      sampleSize:                       event.seedbankRecord?.sampleSize,
      purityDebrisPercentage:           event.seedbankRecord?.purityDebrisPercentage,
      purityPercentage:                 event.seedbankRecord?.purityPercentage,
      dateCollected:                    event.seedbankRecord?.dateCollected,
      dateInStorage:                    event.seedbankRecord?.dateInStorage,
      storageTemperatureInCelsius:      event.seedbankRecord?.storageTemperatureInCelsius,
      relativeHumidityPercentage:       event.seedbankRecord?.relativeHumidityPercentage,
      publicationDOI:                   seedbankVerbatim['http://REPLACE-ME/terms/publicationDOI'],
      preStorageTreatmentNotesHistory:  seedbankVerbatim['http://REPLACE-ME/terms/preStorageTreatmentNotesHistory'],
      primaryStorageSeedBank:           seedbankVerbatim['http://REPLACE-ME/terms/primaryStorageSeedBank'],
      primaryCollector:                 seedbankVerbatim['http://REPLACE-ME/terms/primaryCollector'],
      plantForm:                        seedbankVerbatim['http://REPLACE-ME/terms/plantForm'],
      duplicatesReplicates:             seedbankVerbatim['http://REPLACE-ME/terms/duplicatesReplicates'],
      collectionPermitNumber:           seedbankVerbatim['http://REPLACE-ME/terms/collectionPermitNumber'],
      thousandSeedWeight:               event.seedbankRecord?.thousandSeedWeight,
      numberPlantsSampled:              event.seedbankRecord?.numberPlantsSampled,
      storageBehaviour:                 seedbankVerbatim['http://REPLACE-ME/terms/storageBehaviour'],
      embryoType:                       seedbankVerbatim['http://REPLACE-ME/terms/embryoType'],
      dormancyClass:                    seedbankVerbatim['http://REPLACE-ME/terms/dormancyClass'],
      testDateStarted:                  event.seedbankRecord?.testDateStarted,
      testLengthInDays:                 event.seedbankRecord?.testLengthInDays,
      collectionFillRate:               seedbankVerbatim['http://REPLACE-ME/terms/collectionFillRate'],
      numberGerminated:                 event.seedbankRecord?.numberGerminated,
      germinationRateInDays:            event.seedbankRecord?.germinationRateInDays,
      adjustedGerminationPercentage:    event.seedbankRecord?.adjustedGerminationPercentage,
      viabilityPercentage:              event.seedbankRecord?.viabilityPercentage,
      numberFull:                       event.seedbankRecord?.numberFull,
      numberEmpty:                      event.seedbankRecord?.numberEmpty,
      numberTested:                     event.seedbankRecord?.numberTested,
      preTestProcessingNotes:           seedbankVerbatim['http://REPLACE-ME/terms/preTestProcessingNotes'],
      pretreatment:                     seedbankVerbatim['http://REPLACE-ME/terms/pretreatment'],
      mediaSubstrate:                   seedbankVerbatim['http://REPLACE-ME/terms/mediaSubstrate'],
      nightTemperatureInCelsius:        event.seedbankRecord?.nightTemperatureInCelsius,
      dayTemperatureInCelsius:          event.seedbankRecord?.dayTemperatureInCelsius,
      darkHours:                        event.seedbankRecord?.darkHours,
      lightHours:                       event.seedbankRecord?.lightHours,
    });
  }

  return removeUndefined({
    ...source.event,
    ...source.metadata,
    ...source.derivedMetadata,
    seedbankRecord
  });
}

module.exports = {
  reduce
}