import { IdentityLabel, LifeStageLabel } from '@/components/filters/displayNames';
import {
  filterConfigTypes,
  filterEnumConfig,
  filterSuggestConfig,
} from '@/components/filters/filterTools';
import { Message } from '@/components/message';
import { termToGroup } from '../humboldtTerms';

export const eventIdConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'eventId',
  displayName: IdentityLabel,
  filterTranslation: 'filters.eventId.name',
  allowExistence: false,
  allowNegations: false,
  about: () => <Message id="filters.eventId.description" />,
  facetQuery: /* GraphQL */ `
    query EventEventIdFacet($query: EventSearchInput, $limit: Int) {
      search: eventSearch(query: $query, limit: $limit) {
        facet {
          field: eventId {
            name
            count
          }
        }
      }
    }
  `,
  group: 'event',
};

export const parentEventIdConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'parentEventId',
  displayName: IdentityLabel,
  filterTranslation: 'filters.parentEventId.name',
  allowExistence: false,
  allowNegations: false,
  about: () => <Message id="filters.parentEventId.description" />,
  facetQuery: /* GraphQL */ `
    query ParentEventEventIdFacet($query: EventSearchInput, $limit: Int) {
      search: eventSearch(query: $query, limit: $limit) {
        facet {
          field: parentEventId {
            name
            count
          }
        }
      }
    }
  `,
  group: 'event',
};

export const humboldtProtocolNamesConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'humboldtProtocolNames',
  displayName: IdentityLabel,
  filterTranslation: 'filters.protocolNames.name',
  allowExistence: false,
  allowNegations: false,
  facetQuery: `
    query HumboldtProtocolNamesFacet($query: EventSearchInput, $limit: Int){
      search: eventSearch(query: $query, limit: $limit) {
        
        facet {
          field: humboldtProtocolNames {
            name
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.protocolNames.description" />,
  group: termToGroup['protocolNames'],
};

export const humboldtInventoryTypesConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'humboldtInventoryTypes',
  displayName: IdentityLabel,
  filterTranslation: 'filters.inventoryTypes.name',
  allowExistence: false,
  allowNegations: false,
  facetQuery: `
    query HumboldtInventoryTypesFacet($query: EventSearchInput, $limit: Int){
      search: eventSearch(query: $query, limit: $limit) {
        
        facet {
          field: humboldtInventoryTypes {
            name
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.inventoryTypes.description" />,
  group: termToGroup['inventoryTypes'],
};

export const humboldtProtocolReferencesConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'humboldtProtocolReferences',
  displayName: IdentityLabel,
  filterTranslation: 'filters.protocolReferences.name',
  allowExistence: false,
  allowNegations: false,
  facetQuery: `
    query HumboldtProtocolReferencesFacet($query: EventSearchInput, $limit: Int){
      search: eventSearch(query: $query, limit: $limit) {
        
        facet {
          field: humboldtProtocolReferences {
            name
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.protocolReferences.description" />,
  group: termToGroup['protocolReferences'],
};

export const humboldtSamplingPerformedByConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'humboldtSamplingPerformedBy',
  displayName: IdentityLabel,
  filterTranslation: 'filters.samplingPerformedBy.name',
  allowExistence: false,
  allowNegations: false,
  facetQuery: `
    query HumboldtSamplingPerformedBy($query: EventSearchInput, $limit: Int){
      search: eventSearch(query: $query, limit: $limit) {
        
        facet {
          field: humboldtSamplingPerformedBy {
            name
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.samplingPerformedBy.description" />,
  group: termToGroup['samplingPerformedBy'],
};

export const humboldtSamplingEffortUnitConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'humboldtSamplingEffortUnit',
  displayName: IdentityLabel,
  filterTranslation: 'filters.samplingEffortUnit.name',
  allowExistence: false,
  about: () => <Message id="filters.samplingEffortUnit.description" />,
  facetQuery: `
    query HumboldtSamplingEffortUnit($query: EventSearchInput, $limit: Int){
      search: eventSearch(query: $query, limit: $limit) {
        
        facet {
          field: humboldtSamplingEffortUnit {
            name
            count
          }
        }
      }
    }
  `,
  group: termToGroup['samplingEffortUnit'],
};

export const humboldtTargetDegreeOfEstablishmentScopeConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'humboldtTargetDegreeOfEstablishmentScope',
  displayName: IdentityLabel,
  filterTranslation: 'filters.targetDegreeOfEstablishmentScope.name',
  allowExistence: false,
  about: () => <Message id="filters.samplingEffortUnit.description" />,
  facetQuery: `
    query HumboldtTargetDegreeOfEstablishmentScope($query: EventSearchInput, $limit: Int){
      search: eventSearch(query: $query, limit: $limit) {
        
        facet {
          field: humboldtTargetDegreeOfEstablishmentScope {
            name
            count
          }
        }
      }
    }
  `,
  group: termToGroup['targetDegreeOfEstablishmentScope'],
};

export const humboldtTargetGrowthFormScopeConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'humboldtTargetGrowthFormScope',
  displayName: IdentityLabel,
  filterTranslation: 'filters.targetGrowthFormScope.name',
  allowExistence: false,
  about: () => <Message id="filters.targetGrowthFormScope.description" />,
  facetQuery: `
    query HummboldtTargetGrowthFormScope($query: EventSearchInput, $limit: Int){
      search: eventSearch(query: $query, limit: $limit) {
        
        facet {
          field: humboldtTargetGrowthFormScope {
            name
            count
          }
        }
      }
    }
  `,
  group: termToGroup['targetGrowthFormScope'],
};

export const humboldtTargetHabitatScopeConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'humboldtTargetHabitatScope',
  displayName: IdentityLabel,
  filterTranslation: 'filters.targetHabitatScope.name',
  allowExistence: false,
  about: () => <Message id="filters.targetHabitatScope.description" />,
  facetQuery: `
    query HumboldtTargetHabitatScope($query: EventSearchInput, $limit: Int){
      search: eventSearch(query: $query, limit: $limit) {
        
        facet {
          field: humboldtTargetHabitatScope {
            name
            count
          }
        }
      }
    }
  `,
  group: termToGroup['targetHabitatScope'],
};

export const humboldtTargetLifeStageScopeConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'humboldtTargetLifeStageScope',
  displayName: LifeStageLabel,
  filterTranslation: 'filters.targetLifeStageScope.name',
  allowExistence: false,
  about: () => <Message id="filters.targetLifeStageScope.description" />,
  facetQuery: `
    query humboldtTargetLifeStageScope($query: EventSearchInput, $limit: Int){
      search: eventSearch(query: $query, limit: $limit) {
        facet {
          field: humboldtTargetLifeStageScope {
            name
            count
          }
        }
      }
    }
  `,
  group: termToGroup['targetLifeStageScope'],
};

export const humboldtTotalAreaSampledUnitConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'humboldtTotalAreaSampledUnit',
  displayName: IdentityLabel,
  filterTranslation: 'filters.totalAreaSampledUnit.name',
  allowExistence: false,
  about: () => <Message id="filters.totalAreaSampledUnit.description" />,
  facetQuery: `
    query humboldtTotalAreaSampledUnit($query: EventSearchInput, $limit: Int){
      search: eventSearch(query: $query, limit: $limit) {
        
        facet {
          field: humboldtTotalAreaSampledUnit {
            name
            count
          }
        }
      }
    }
  `,
  group: termToGroup['totalAreaSampledUnit'],
};

export const humboldtTargetTaxonomicScopeUsageNameConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'humboldtTargetTaxonomicScopeUsageName',
  displayName: IdentityLabel,
  filterTranslation: 'filters.targetTaxonomicScope.name',
  allowExistence: false,
  about: () => <Message id="filters.targetTaxonomicScope.description" />,
  facetQuery: `
    query humboldtTargetTaxonomicScopeUsageName($query: EventSearchInput, $limit: Int){
      search: eventSearch(query: $query, limit: $limit) {
        
        facet {
          field: humboldtTargetTaxonomicScopeUsageName {
            name
            count
          }
        }
      }
    }
  `,
  group: termToGroup['targetTaxonomicScope'],
};

export const humboldtMaterialSampleTypesConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'humboldtMaterialSampleTypes',
  displayName: IdentityLabel,
  filterTranslation: 'filters.materialSampleTypes.name',
  allowExistence: false,
  about: () => <Message id="filters.materialSampleTypes.description" />,
  facetQuery: `
    query HumboldtMaterialSampleTypes($query: EventSearchInput, $limit: Int){
      search: eventSearch(query: $query, limit: $limit) {
        
        facet {
          field: humboldtMaterialSampleTypes {
            name
            count
          }
        }
      }
    }
  `,
  group: termToGroup['materialSampleTypes'],
};

export const localityConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'locality',
  displayName: IdentityLabel,
  filterTranslation: 'filters.locality.name',
  allowExistence: false,
  allowNegations: false,
  facetQuery: `
    query EventLocalityFacet($query: EventSearchInput, $limit: Int){
      search: eventSearch( query: $query, limit: $limit) {
       
        facet {
          field: locality{
            name
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.locality.description" />,
  group: 'location',
};

export const eventTypeConfig: filterSuggestConfig = {
  filterType: filterConfigTypes.SUGGEST,
  filterHandle: 'eventType',
  displayName: IdentityLabel,
  filterTranslation: 'filters.eventType.name',
  allowExistence: false,
  allowNegations: false,
  facetQuery: `
    query EventTypeFacet($q: String, $query: EventSearchInput, $limit: Int){
      search: eventSearch(q: $q, query: $query, limit: $limit) {
       
        facet {
          field: eventType {
            name
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.eventType.description" />,
  group: 'event',
};
