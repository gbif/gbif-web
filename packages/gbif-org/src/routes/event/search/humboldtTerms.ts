const terms = [
  {
    group: 'site',
    name: 'siteCount',
  },
  {
    group: 'site',
    name: 'siteNestingDescription',
  },
  {
    group: 'site',
    name: 'verbatimsiteDescriptions',
  },
  {
    group: 'site',
    name: 'verbatimsiteNames',
  },
  {
    group: 'site',
    name: 'geospatialScopeAreaValue',
  },
  {
    group: 'site',
    name: 'geospatialScopeAreaUnit',
  },
  {
    group: 'site',
    name: 'totalAreaSampledValue',
  },
  {
    group: 'site',
    name: 'totalAreaSampledUnit',
  },
  {
    group: 'site',
    name: 'reportedWeather',
  },
  {
    group: 'site',
    name: 'reportedExtremeConditions',
  },
  {
    group: 'habitatScope',
    name: 'targetHabitatScope',
  },
  {
    group: 'habitatScope',
    name: 'excludedHabitatScope',
  },
  {
    group: 'temporalScope',
    name: 'eventDurationValue',
  },
  {
    group: 'temporalScope',
    name: 'eventDurationUnit',
  },
  {
    group: 'taxonomicScope',
    name: 'targetTaxonomicScope',
  },
  {
    group: 'taxonomicScope',
    name: 'excludedTaxonomicScope',
  },
  {
    group: 'taxonomicScope',
    name: 'taxonCompletenessReported',
  },
  {
    group: 'taxonomicScope',
    name: 'taxonCompletenessProtocols',
  },
  {
    group: 'taxonomicScope',
    name: 'isTaxonomicScopeFullyReported',
  },
  {
    group: 'taxonomicScope',
    name: 'isAbsenceReported',
  },
  {
    group: 'taxonomicScope',
    name: 'absentTaxa',
  },
  {
    group: 'taxonomicScope',
    name: 'hasNonTargetTaxa',
  },
  {
    group: 'taxonomicScope',
    name: 'nonTargetTaxa',
  },
  {
    group: 'taxonomicScope',
    name: 'areNonTargetTaxaFullyReported',
  },
  {
    group: 'organismalScope',
    name: 'targetLifeStageScope',
  },
  {
    group: 'organismalScope',
    name: 'excludedLifeStageScope',
  },
  {
    group: 'organismalScope',
    name: 'isLifeStageScopeFullyReported',
  },
  {
    group: 'organismalScope',
    name: 'targetDegreeOfEstablishmentScope',
  },
  {
    group: 'organismalScope',
    name: 'excludedDegreeOfEstablishmentScope',
  },
  {
    group: 'organismalScope',
    name: 'isDegreeOfEstablishmentScopeFullyReported',
  },
  {
    group: 'organismalScope',
    name: 'targetGrowthFormScope',
  },
  {
    group: 'organismalScope',
    name: 'excludedGrowthFormScope',
  },
  {
    group: 'organismalScope',
    name: 'isGrowthFormScopeFullyReported',
  },
  {
    group: 'organismalScope',
    name: 'hasNonTargetOrganisms',
  },
  {
    group: 'organismalScope',
    name: 'verbatimTargetScope',
  },
  {
    group: 'identification',
    name: 'identifiedBy',
  },
  {
    group: 'identification',
    name: 'identificationReferences',
  },
  {
    group: 'methodologyDescription',
    name: 'compilationTypes',
  },
  {
    group: 'methodologyDescription',
    name: 'compilationSourceTypes',
  },
  {
    group: 'methodologyDescription',
    name: 'inventoryTypes',
  },
  {
    group: 'methodologyDescription',
    name: 'protocolNames',
  },
  {
    group: 'methodologyDescription',
    name: 'protocolDescriptions',
  },
  {
    group: 'methodologyDescription',
    name: 'protocolReferences',
  },
  {
    group: 'methodologyDescription',
    name: 'isAbundanceReported',
  },
  {
    group: 'methodologyDescription',
    name: 'isAbundanceCapReported',
  },
  {
    group: 'methodologyDescription',
    name: 'abundanceCap',
  },
  {
    group: 'methodologyDescription',
    name: 'isVegetationCoverReported',
  },
  {
    group: 'methodologyDescription',
    name: 'isLeastSpecificTargetCategoryQuantityInclusive',
  },
  {
    group: 'materialCollected',
    name: 'hasVouchers',
  },
  {
    group: 'materialCollected',
    name: 'voucherInstitutions',
  },
  {
    group: 'materialCollected',
    name: 'hasMaterialSamples',
  },
  {
    group: 'materialCollected',
    name: 'materialSampleTypes',
  },
  {
    group: 'samplingEffort',
    name: 'samplingPerformedBy',
  },
  {
    group: 'samplingEffort',
    name: 'isSamplingEffortReported',
  },
  {
    group: 'samplingEffort',
    name: 'samplingEffortProtocol',
  },
  {
    group: 'samplingEffort',
    name: 'samplingEffortValue',
  },
  {
    group: 'samplingEffort',
    name: 'samplingEffortUnit',
  },
];

export const termToGroup = Object.fromEntries(new Map(terms.map((t) => [t.name, t.group])));

export default terms;
