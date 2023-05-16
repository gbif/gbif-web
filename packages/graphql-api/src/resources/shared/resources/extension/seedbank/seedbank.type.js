import { gql } from 'apollo-server';

const typeDef = gql`
  type SeedBankExtension {
    id: String!
    degreeOfEstablishment: String
    accessionNumber: String
    seedPerGram: Float
    formInStorage: String
    quantityInGrams: Float
    quantityCount: Int
    purityPercentage: Float
    dateCollected: Long
    dateInStorage: Long
    storageTemperatureInCelsius: Float
    storageRelativeHumidityPercentage: Float
    publicationDOI: String
    preStorageTreatment: String
    primaryStorageSeedBank: String
    primaryCollector: String
    plantForm: String
    duplicatesReplicates: String
    collectionPermitNumber: String
    thousandSeedWeight: Float
    numberPlantsSampled: String
    storageBehaviour: String
    esRatio: String
    dormancyClass: String
    testDateStarted: Long
    testLengthInDays: Int
    collectionFill: String
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
