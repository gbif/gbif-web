import { unique } from '@/utils/unique';

type TabMetadata = {
  contentTypes: string[];
  countKey: string;
  tabKey: string;
  filters: string[];
};

export const orderedTabs = [
  'all',
  'news',
  'dataUse',
  'event',
  'project',
  'programme',
  'tool',
  'document',
];

export const tabsConfig: Record<string, TabMetadata> = {
  all: {
    contentTypes: ['news', 'dataUse', 'event', 'project', 'programme', 'tool', 'document'],
    countKey: 'counts.nResults',
    tabKey: 'resourceSearch.types.all',
    filters: ['q'],
  },
  news: {
    contentTypes: ['news'],
    countKey: 'counts.nNews',
    tabKey: 'resourceSearch.types.news',
    filters: ['q', 'countriesOfCoverage', 'topics'],
  },
  dataUse: {
    contentTypes: ['dataUse'],
    countKey: 'counts.nDataUse',
    tabKey: 'resourceSearch.types.dataUse',
    filters: ['q', 'countriesOfResearcher', 'countriesOfCoverage', 'topics'],
  },
  event: {
    contentTypes: ['event'],
    countKey: 'counts.nEvents',
    tabKey: 'resourceSearch.types.events',
    filters: ['q', '_showPastEvents'],
  },
  project: {
    contentTypes: ['project'],
    countKey: 'counts.nProjects',
    tabKey: 'resourceSearch.types.projects',
    filters: ['q', 'contractCountry', 'gbifProgrammeAcronym', 'purposes'],
  },
  programme: {
    contentTypes: ['programme'],
    countKey: 'counts.nProgrammes',
    tabKey: 'resourceSearch.types.programmes',
    filters: ['q'],
  },
  tool: {
    contentTypes: ['tool'],
    countKey: 'counts.nTools',
    tabKey: 'resourceSearch.types.tools',
    filters: ['q'],
  },
  document: {
    contentTypes: ['document'],
    countKey: 'counts.nDocuments',
    tabKey: 'resourceSearch.types.documents',
    filters: ['q'],
  },
};

export const allFilters = unique(Object.values(tabsConfig).flatMap((tab) => tab.filters));
