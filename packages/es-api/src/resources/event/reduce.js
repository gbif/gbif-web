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

  // Additional event verbatim fields
  const eventVerbatim = removeUndefined({
    eventRemarks: source.verbatim.core['http://rs.tdwg.org/dwc/terms/eventRemarks']
  });

  // Handle seedbank extension
  let seedbankRecord;
  const seedbankExtension = source.verbatim.extensions?.['http://ala.org.au/terms/seedbank/0.1/SeedbankRecord'];

  // Ensure the seed bank extension exists before mapping the verbatim values
  if (seedbankExtension) {
    const [seedbankVerbatim] = seedbankExtension;
    seedbankRecord = removeUndefined({
      id:                                 event.seedbankRecord?.id,
      eventID:                            seedbankVerbatim['http://rs.tdwg.org/dwc/terms/eventID'],
      degreeOfEstablishment:              seedbankVerbatim['http://rs.tdwg.org/dwc/terms/degreeOfEstablishment'],
      accessionNumber:                    seedbankVerbatim['http://ala.org.au/terms/seedbank/0.1/accessionNumber'],
      seedPerGram:                        event.seedbankRecord?.seedPerGram,
      formInStorage:                      seedbankVerbatim['http://ala.org.au/terms/seedbank/0.1/formInStorage'],
      quantityInGrams:                    event.seedbankRecord?.quantityInGrams,
      quantityCount:                      event.seedbankRecord?.quantityCount,
      purityPercentage:                   event.seedbankRecord?.purityPercentage,
      dateCollected:                      event.seedbankRecord?.dateCollected,
      dateInStorage:                      event.seedbankRecord?.dateInStorage,
      storageTemperatureInCelsius:        event.seedbankRecord?.storageTemperatureInCelsius,
      storageRelativeHumidityPercentage:  event.seedbankRecord?.storageRelativeHumidityPercentage,
      publicationDOI:                     seedbankVerbatim['http://ala.org.au/terms/seedbank/0.1/publicationDOI'],
      preStorageTreatment:                seedbankVerbatim['http://ala.org.au/terms/seedbank/0.1/preStorageTreatment'],
      primaryStorageSeedBank:             seedbankVerbatim['http://ala.org.au/terms/seedbank/0.1/primaryStorageSeedBank'],
      primaryCollector:                   seedbankVerbatim['http://ala.org.au/terms/seedbank/0.1/primaryCollector'],
      plantForm:                          seedbankVerbatim['http://ala.org.au/terms/seedbank/0.1/plantForm'],
      duplicatesReplicates:               seedbankVerbatim['http://ala.org.au/terms/seedbank/0.1/duplicatesReplicates'],
      collectionPermitNumber:             seedbankVerbatim['http://ala.org.au/terms/seedbank/0.1/collectionPermitNumber'],
      thousandSeedWeight:                 event.seedbankRecord?.thousandSeedWeight,
      numberPlantsSampled:                event.seedbankRecord?.numberPlantsSampled,
      storageBehaviour:                   seedbankVerbatim['http://ala.org.au/terms/seedbank/0.1/storageBehaviour'],
      esRatio:                         seedbankVerbatim['http://ala.org.au/terms/seedbank/0.1/esRatio'],
      dormancyClass:                      seedbankVerbatim['http://ala.org.au/terms/seedbank/0.1/dormancyClass'],
      testDateStarted:                    event.seedbankRecord?.testDateStarted,
      testLengthInDays:                   event.seedbankRecord?.testLengthInDays,
      collectionFill:                     seedbankVerbatim['http://ala.org.au/terms/seedbank/0.1/collectionFill'],
      numberGerminated:                   event.seedbankRecord?.numberGerminated,
      germinationRateInDays:              event.seedbankRecord?.germinationRateInDays,
      adjustedGerminationPercentage:      event.seedbankRecord?.adjustedGerminationPercentage,
      viabilityPercentage:                event.seedbankRecord?.viabilityPercentage,
      numberFull:                         event.seedbankRecord?.numberFull,
      numberEmpty:                        event.seedbankRecord?.numberEmpty,
      numberTested:                       event.seedbankRecord?.numberTested,
      numberNotViable:                    event.seedbankRecord?.numberNotViable,
      preTestProcessingNotes:             seedbankVerbatim['http://ala.org.au/terms/seedbank/0.1/preTestProcessingNotes'],
      pretreatment:                       seedbankVerbatim['http://ala.org.au/terms/seedbank/0.1/pretreatment'],
      mediaSubstrate:                     seedbankVerbatim['http://ala.org.au/terms/seedbank/0.1/mediaSubstrate'],
      nightTemperatureInCelsius:          event.seedbankRecord?.nightTemperatureInCelsius,
      dayTemperatureInCelsius:            event.seedbankRecord?.dayTemperatureInCelsius,
      darkHours:                          event.seedbankRecord?.darkHours,
      lightHours:                         event.seedbankRecord?.lightHours,
    }); 
  }

  return removeUndefined({
    ...source.event,
    ...source.metadata,
    ...source.derivedMetadata,
    ...eventVerbatim,
    seedbankRecord
  });
}

module.exports = {
  reduce
}