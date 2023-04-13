import { gql } from 'apollo-server';

const typeDef = gql`
  type SeedBankExtension {
    id: String!
    degreeOfEstablishment: String
    accessionNumber: String
    seedPerGram: Float
    formInStorage: String
    sampleWeightInGrams: Float
    sampleSize: Int
    purityDebrisPercentage: Float
    purityPercentage: Float
    dateCollected: Long
    dateInStorage: Long
    storageTemperatureInCelsius: Float
    relativeHumidityPercentage: Float
    publicationDOI: String
    preStorageTreatmentNotesHistory: String
    primaryStorageSeedBank: String
    primaryCollector: String
    plantForm: String
    duplicatesReplicates: String
    collectionPermitNumber: String
    thousandSeedWeight: Float
    numberPlantsSampled: String
    storageBehaviour: String
    embryoType: String
    dormancyClass: String
    testDateStarted: Long
    testLengthInDays: Int
    collectionFillRate: String
    numberGerminated: Int
    germinationRateInDays: Int
    adjustedGerminationPercentage: Float
    viabilityPercentage: Float
    numberFull: Int
    numberEmpty: Int
    numberTested: Int
    preTestProcessingNotes: String
    pretreatment: String
    mediaSubstrate: String
    nightTemperatureInCelsius: Float
    dayTemperatureInCelsius: Float
    darkHours: Float
    lightHours: Float
  }
`;

export default typeDef;
