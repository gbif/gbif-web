import { useConfig } from '@/config/config';
import { useI18n } from '@/reactRouterPlugins';

const BACKBONE_CHECKLIST_KEY = import.meta.env.PUBLIC_CLASSIC_BACKBONE_KEY;
const COL_CHECKLIST_KEY = import.meta.env.PUBLIC_COL_CHECKLIST_KEY;
const CHECKLIST_BANK_WEBSITE = 'https://www.checklistbank.org';
const GBIF_ORG = import.meta.env.PUBLIC_GBIF_ORG;

export type EntityLink =
  | { kind: 'internal'; pageId: string; variables: Record<string, string> }
  | { kind: 'external'; url: string }
  | { kind: 'none' };

/** Where taxa of a given checklist are shown. Changing the policy means changing resolveTarget alone. */
type LinkTarget = 'speciesPage' | 'taxonPage' | 'gbifOrgTaxonPage' | 'checklistBank' | 'none';

function resolveTarget({
  checklistKey,
  siteChecklistKey,
  clbDatasetKey,
}: {
  checklistKey?: string;
  siteChecklistKey?: string;
  clbDatasetKey?: string;
}): LinkTarget {
  if (!checklistKey) return 'none';

  // The taxon page only renders the site's own checklist, so it is the only one we can link internally.
  const isSiteChecklist = checklistKey === siteChecklistKey;

  // Backbone usage keys are integers, and /species is the route that understands them.
  if (checklistKey === BACKBONE_CHECKLIST_KEY) return 'speciesPage';
  // CoL is what gbif.org's taxon pages show, so sites without their own taxon page can fall back to it.
  if (checklistKey === COL_CHECKLIST_KEY) {
    return isSiteChecklist ? 'taxonPage' : 'gbifOrgTaxonPage';
  }
  return clbDatasetKey ? 'checklistBank' : 'none';
}

/**
 * Resolves where taxa of a checklist should be linked. Every taxon link on the occurrence page goes
 * through this so they cannot drift apart.
 */
export function useTaxonLinks({
  checklistKey,
  clbDatasetKey,
}: {
  checklistKey?: string;
  clbDatasetKey?: string;
}): {
  dataset: EntityLink;
  taxon: (key?: string | null) => EntityLink;
} {
  const config = useConfig();
  const { locale } = useI18n();

  const siteChecklistKey = config.taxonSearch?.checklistKey ?? config.defaultChecklistKey;
  const gbifOrgLocalePrefix = locale?.gbifOrgLocalePrefix ?? '';
  const target = resolveTarget({ checklistKey, siteChecklistKey, clbDatasetKey });

  const dataset: EntityLink =
    target === 'checklistBank' && clbDatasetKey
      ? { kind: 'external', url: `${CHECKLIST_BANK_WEBSITE}/dataset/${clbDatasetKey}/about` }
      : checklistKey
        ? { kind: 'internal', pageId: 'datasetKey', variables: { key: checklistKey } }
        : { kind: 'none' };

  const taxon = (key?: string | null): EntityLink => {
    if (!key) return { kind: 'none' };

    switch (target) {
      case 'speciesPage':
        return { kind: 'internal', pageId: 'speciesKey', variables: { key } };
      case 'taxonPage':
        return { kind: 'internal', pageId: 'taxonKey', variables: { key } };
      case 'gbifOrgTaxonPage':
        return {
          kind: 'external',
          url: `${GBIF_ORG}${gbifOrgLocalePrefix}/taxon/${encodeURIComponent(key)}`,
        };
      case 'checklistBank':
        return {
          kind: 'external',
          url: `${CHECKLIST_BANK_WEBSITE}/dataset/${clbDatasetKey}/taxon/${encodeURIComponent(
            key
          )}`,
        };
      default:
        return { kind: 'none' };
    }
  };

  return { dataset, taxon };
}
