import { ComponentType, lazy } from 'react';
import type { Validation } from '../data/types';

export type ReportRendererProps = { validation: Validation };

const LegacyReport = lazy(() => import('./legacy/LegacyReport'));

// One entry per file format. A format without a renderer still gets the status, the steps and the
// file information, so new formats degrade cleanly until they get their own view.
const renderers: Record<string, ComponentType<ReportRendererProps>> = {
  DWCA: LegacyReport,
  XML: LegacyReport,
  TABULAR: LegacyReport,
  SPREADSHEET: LegacyReport,
  COLDP: LegacyReport,
};

export function getReportRenderer(
  fileFormat: string | null | undefined
): ComponentType<ReportRendererProps> | undefined {
  return fileFormat ? renderers[fileFormat] : undefined;
}
