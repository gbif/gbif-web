import { BulletList } from '@/components/bulletList';
import { Classification } from '@/components/classification';
import { ChecklistClassification } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { cn } from '@/utils/shadcn';
import { BsLightningFill } from 'react-icons/bs';
import { HiExternalLink as ExternalLinkIcon } from 'react-icons/hi';
import { FormattedMessage } from 'react-intl';

const speciesPageDatasetKey = import.meta.env.PUBLIC_DEFAULT_CHECKLIST_KEY;
export function TaxonInterpretationCard({
  classification,
}: {
  classification: ChecklistClassification;
}) {
  const useChecklistBankLink = speciesPageDatasetKey !== classification.checklistKey;
  const noMatch = classification?.usage?.key.toString() === '0';
  const issues = classification?.issues ?? [];
  const useCoLWebsiteLink =
    import.meta.env.PUBLIC_COL_CHECKLIST_KEY === classification.checklistKey;

  const externalDatasetLink = useCoLWebsiteLink
    ? `https://www.catalogueoflife.org`
    : `https://www.checklistbank.org/dataset/${classification?.meta?.mainIndex.datasetKey}/about`;

  const externalTaxonLink = useCoLWebsiteLink
    ? `https://www.catalogueoflife.org/data/taxon/${classification?.usage?.key}`
    : `https://www.checklistbank.org/dataset/${
        classification?.meta?.mainIndex?.datasetKey
      }/taxon/${encodeURIComponent(classification?.usage?.key)}`;

  return (
    <div
      className={cn('g-mb-4 g-w-full g-bg-slate-100 g-rounded', {
        'g-border-s-primary-500 g-border-s-4':
          classification?.checklistKey === speciesPageDatasetKey,
      })}
    >
      <div className="g-overflow-hidden g-transition-all g-duration-300">
        <div className="g-p-4 g-flex g-items-start g-justify-between">
          <div className="g-flex-1">
            <div className="g-flex g-items-center g-space-x-2 g-mb-2">
              {useChecklistBankLink && (
                <a
                  href={externalDatasetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="g-text-sm g-font-medium g-text-slate-600 hover:g-text-primary-500"
                >
                  {classification?.meta?.mainIndex?.datasetTitle}{' '}
                  {/* <ExternalLinkIcon className="g-align-baseline" /> */}
                </a>
              )}
              {!useChecklistBankLink && (
                <DynamicLink
                  className="g-text-sm g-font-medium g-text-slate-600 hover:g-text-primary-500 "
                  pageId="datasetKey"
                  variables={{ key: classification?.checklistKey }}
                >
                  {classification?.meta?.mainIndex?.datasetTitle}
                </DynamicLink>
              )}
            </div>

            {/* <h4
              className="g-text-lg g-font-medium g-text-gray-900 g-underline"
              dangerouslySetInnerHTML={{
                __html:
                  classification.taxonMatch?.usage.formattedName ??
                  classification.taxonMatch?.usage.name,
              }}
            /> */}
            <h4>
              {useChecklistBankLink && !noMatch && (
                <>
                  <a
                    href={externalTaxonLink}
                    target="_blank"
                    className="g-text-lg g-font-medium g-text-gray-900 g-underline hover:g-text-primary-500"
                    rel="noopener noreferrer"
                    dangerouslySetInnerHTML={{
                      __html:
                        classification.taxonMatch?.usage.formattedName ??
                        classification.taxonMatch?.usage.name,
                    }}
                  />{' '}
                  <ExternalLinkIcon className="g-align-baseline" />
                </>
              )}
              {noMatch && (
                <span
                  className="g-text-lg g-font-medium g-text-gray-900"
                  dangerouslySetInnerHTML={{
                    __html:
                      classification.taxonMatch?.usage.formattedName ??
                      classification.taxonMatch?.usage.name,
                  }}
                />
              )}
              {!useChecklistBankLink && !noMatch && (
                <DynamicLink
                  className="g-text-lg g-font-medium g-text-gray-900 g-underline hover:g-text-primary-500"
                  pageId="speciesKey"
                  variables={{ key: classification?.usage?.key }}
                  dangerouslySetInnerHTML={{
                    __html:
                      classification.taxonMatch?.usage.formattedName ??
                      classification.taxonMatch?.usage.name,
                  }}
                />
              )}
            </h4>
            <Classification className="g-text-xs g-text-slate-600">
              {classification.classification?.map((rank) => {
                return (
                  <span key={rank.key}>
                    <span className="g-pe-1">
                      <FormattedMessage
                        id={`enums.taxonRank.${rank.rank}`}
                        defaultMessage={rank.rank}
                      />
                    </span>
                    {rank.name}
                  </span>
                );
              })}
            </Classification>

            {issues?.length > 0 && (
              <div className="g-mt-2 g-flex g-flex-wrap g-gap-1 g-text-xs g-text-slate-700 ">
                <BsLightningFill className="g-flex-none g-h-[1.2em]" style={{ color: 'orange' }} />
                <BulletList>
                  {issues?.map((issue) => (
                    <li key={issue}>
                      <FormattedMessage
                        id={`enums.occurrenceIssue.${issue}`}
                        defaultMessage={issue}
                      />
                    </li>
                  ))}
                </BulletList>
              </div>
            )}
            {classification.acceptedUsage.key !== classification.usage.key && (
              <div className="g-text-xs g-text-slate-700 g-mt-2">
                {classification.taxonMatch?.synonym && (
                  <span className="g-me-4 g-bg-orange-400 g-rounded-full g-px-2 g-text-white">
                    <FormattedMessage id="enums.taxonomicStatus.SYNONYM" defaultMessage="Synonym" />
                  </span>
                )}
                <span className="g-text-slate-600 g-font-medium">
                  accepted name:{' '}
                  <DynamicLink
                    pageId="speciesKey"
                    className="g-underline"
                    variables={{ key: classification.acceptedUsage.key }}
                  >
                    {classification.acceptedUsage.name}
                  </DynamicLink>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
