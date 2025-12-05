import { FaCog, FaFileAlt, FaDownload } from 'react-icons/fa';
import { ComponentType } from 'react';
import { FilterIcon } from '@/components/icons/icons';
import { FaSection } from 'react-icons/fa6';

export interface Step {
  ordering: number;
  id: string;
  name: string;
  icon: ComponentType<{ className?: string }>;
  description: string;
}

export const stepOptions: Record<string, Step> = {
  QUALITY: {
    ordering: 0,
    id: 'QUALITY',
    name: 'occurrenceDownloadFlow.steps.quality.name',
    icon: FilterIcon,
    description: 'occurrenceDownloadFlow.steps.quality.description',
  },
  PREDICATE: {
    ordering: 1,
    id: 'PREDICATE',
    name: 'occurrenceDownloadFlow.steps.filter.name',
    icon: FilterIcon,
    description: 'occurrenceDownloadFlow.steps.filter.description',
  },
  SQL: {
    ordering: 2,
    id: 'SQL',
    name: 'occurrenceDownloadFlow.steps.sql.name',
    icon: FilterIcon,
    description: 'occurrenceDownloadFlow.steps.sql.description',
  },
  FORMAT: {
    ordering: 3,
    id: 'FORMAT',
    name: 'occurrenceDownloadFlow.steps.format.name',
    icon: FaFileAlt,
    description: 'occurrenceDownloadFlow.steps.format.description',
  },
  CONFIGURE: {
    ordering: 4,
    id: 'CONFIGURE',
    name: 'occurrenceDownloadFlow.steps.configure.name',
    icon: FaCog,
    description: 'occurrenceDownloadFlow.steps.configure.description',
  },
  TERMS: {
    ordering: 5,
    id: 'TERMS',
    name: 'occurrenceDownloadFlow.steps.terms.name',
    icon: FaSection,
    description: 'occurrenceDownloadFlow.steps.terms.description',
  },
};

export const occurrenceDownloadSteps: Step[] = [
  // stepOptions.QUALITY,
  stepOptions.FORMAT,
  stepOptions.CONFIGURE,
  stepOptions.TERMS,
];

export const sqlDownloadSteps: Step[] = [stepOptions.SQL, stepOptions.TERMS];

export const predicateDownloadSteps: Step[] = [
  stepOptions.PREDICATE,
  stepOptions.FORMAT,
  stepOptions.CONFIGURE,
  stepOptions.TERMS,
];
