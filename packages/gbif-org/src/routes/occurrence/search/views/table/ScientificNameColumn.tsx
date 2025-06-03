import { SetAsFilter } from '@/components/searchTable';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { GoSidebarExpand } from 'react-icons/go';
import useLocalStorage from 'use-local-storage';
import { SingleOccurrenceSearchResult } from './occurrenceTable';

export default function ScientificNameColumn({
  occurrence,
  showPreview,
}: {
  occurrence: SingleOccurrenceSearchResult;
  showPreview?: ((id: string) => void) | false;
}) {
  const [includeAuthorship] = useLocalStorage('includeAuthorship', false);
  const entityKey = `o_${occurrence?.key?.toString()}`;

  const hasClassification = occurrence?.classification;
  const canonicalName = occurrence.classification?.taxonMatch?.usage?.canonicalName;
  const showCanonicalName = canonicalName && !includeAuthorship;

  return (
    <div className="g-inline-flex g-items-start g-w-full">
      {typeof showPreview === 'function' && (
        <button
          // Used to refocus this button after closing the preview dialog
          data-entity-trigger={entityKey}
          className="g-pr-3 g-mt-0.5 g-pl-1 hover:g-text-primary-500 g-flex g-items-center g-pointer-events-auto"
          onClick={() => showPreview(entityKey)}
        >
          <SimpleTooltip i18nKey="filterSupport.viewDetails" side="right" asChild>
            <div className="g-flex g-items-center">
              <GoSidebarExpand size={16} />
            </div>
          </SimpleTooltip>
        </button>
      )}
      <div>
        {!hasClassification && (
          <>
            {!occurrence.verbatimScientificName && (
              <span className="g-text-slate-400">Unknown</span>
            )}
            {occurrence.verbatimScientificName && (
              <div>
                <SimpleTooltip side="right" i18nKey="filterSupport.nameWithTaxonMatchIssue">
                  <div
                    style={{ color: '#fea600' }}
                    className="g-cursor-default g-text-start"
                    data-loader
                  >
                    {occurrence.verbatimScientificName}
                  </div>
                </SimpleTooltip>
              </div>
            )}
          </>
        )}
        {hasClassification && (
          <SetAsFilter field="taxonKey" value={occurrence.taxonKey}>
            {!showCanonicalName && (
              <span
                className="g-pointer-events-auto g-me-2"
                dangerouslySetInnerHTML={{
                  __html: occurrence?.classification?.taxonMatch?.usage?.formattedName as string,
                }}
              />
            )}
            {showCanonicalName && (
              <span className="g-pointer-events-auto g-me-2">{canonicalName}</span>
            )}
          </SetAsFilter>
        )}
        {occurrence?.classification?.hasTaxonIssues && (
          <div>
            <SimpleTooltip side="right" i18nKey="filterSupport.nameWithTaxonMatchIssue">
              <div
                style={{ color: '#fea600' }}
                className="g-cursor-default g-text-start"
                data-loader
              >
                {occurrence.verbatimScientificName}
              </div>
            </SimpleTooltip>
          </div>
        )}
        {/* </LinkOption> */}
      </div>
    </div>
  );
}
