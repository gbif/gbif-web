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
  {
    id: 'taxonKey',
    type: FilterType.MultiOptionsFilter,
    name: 'Kingdom',
    options: [
      { label: 'Animalia', value: "1" },
      { label: 'Plantae', value: "2" },
      { label: 'Fungi', value: "5" },
    ],
  },
];
