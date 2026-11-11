import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { CLB_CATEGORY, OCC_CATEGORY } from '../data/normalizeReport';
import type { DwcExtension } from '../data/types';

export function humanize(id: string) {
  const text = id.replace(/_/g, ' ').trim().toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function issueLabelIds(issue: string, category?: string) {
  if (category === OCC_CATEGORY) return [`enums.occurrenceIssue.${issue}`];
  if (category === CLB_CATEGORY) {
    return [`enums.taxonIssue.${issue}`, `enums.nameUsageIssue.${issue}`];
  }
  return [`tools.dataValidator.issueType.${issue}`];
}

// Labels for ids the API sends. The id is shown humanised when no translation exists, never as a
// raw message key.
export function useLabels() {
  const intl = useIntl();

  const first = useCallback(
    (ids: string[]) => ids.find((id) => intl.messages[id] !== undefined),
    [intl.messages]
  );

  const translate = useCallback(
    (ids: string[], fallback: string) => {
      const id = first(ids);
      return id ? intl.formatMessage({ id }) : fallback;
    },
    [first, intl]
  );

  return useMemo(
    () => ({
      issue: (issue: string, category?: string) =>
        translate(issueLabelIds(issue, category), humanize(issue)),
      issueHelp: (issue: string) => {
        const id = first([`enums.issueHelp.${issue}`]);
        return id ? intl.formatMessage({ id }) : undefined;
      },
      category: (category: string) =>
        translate([`tools.dataValidator.category.${category}`], humanize(category)),
      status: (status: string) =>
        translate([`tools.dataValidator.status.${status}`], humanize(status)),
      step: (stepType: string, status: string) =>
        translate(
          [`tools.dataValidator.steps.${stepType}.${status}`],
          `${humanize(stepType.replace(/^VALIDATOR_/, ''))}: ${humanize(status).toLowerCase()}`
        ),
      fileFormat: (format: string) =>
        translate([`tools.dataValidator.fileFormat.${format}`], format),
      rowType: (rowType: string, extensions: Record<string, DwcExtension>) =>
        extensions[rowType]?.title ?? translate([`enums.dwcaExtension.${rowType}`], rowType),
    }),
    [translate, first, intl]
  );
}

export type Labels = ReturnType<typeof useLabels>;
