import { FilterType, TableFilter } from '@/components/tableFilters/types';

export const ocurrenceSearchFilterDefinitions: Array<Omit<TableFilter, 'selectedValues'>> = [
  {
    id: 'occurrenceStatus',
    type: FilterType.MultiOptionsFilter,
    name: 'Occurrence status',
    options: [
      { label: 'Present', value: 'PRESENT' },
      { label: 'Absent', value: 'ABSENT' },
    ],
  },
];
