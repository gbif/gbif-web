import { BulletList } from '@/components/bulletList';
import { Classification } from '@/components/classification';
import { DatasetLabel } from '@/components/filters/displayNames';
import { useConfig } from '@/config/config';
import { ChecklistClassification } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { cn } from '@/utils/shadcn';
import { BsLightningFill } from 'react-icons/bs';
import { HiExternalLink as ExternalLinkIcon } from 'react-icons/hi';
import { FormattedMessage } from 'react-intl';

export function TaxonInterpretationCard({
  classification,
}: {
  classification: ChecklistClassification;
}) {
  const config = useConfig();
  const useChecklistBankLink = config.defaultChecklistKey !== classification.checklistKey;
  const usageKey = classification?.usage?.key;
  const usageName = classification?.usage?.name;
  const noMatch = !usageKey || !usageName;
  if (noMatch) return <ChecklistNoMatchCard checklistKey={classification.checklistKey} />;
  const issues = classification?.issues ?? [];

  const externalDatasetLink = `https://www.checklistbank.org/dataset/${classification?.meta?.mainIndex.clbDatasetKey}/about`;

  const externalTaxonLink = `https://www.checklistbank.org/dataset/${
    classification?.meta?.mainIndex?.clbDatasetKey
  }/taxon/${encodeURIComponent(usageKey)}`;

  return (
    <div
      className={cn('g-mb-4 g-w-full g-bg-slate-100 g-rounded', {
        'g-border-s-primary-500 g-border-s-4':
          classification?.checklistKey === config.defaultChecklistKey,
      })}
    >
      <div className="g-overflow-hidden g-transition-all g-duration-300">
        <div className="g-p-4 g-flex g-items-start g-justify-between">
          <div className="g-flex-1">
            <div className="g-flex g-items-center g-gap-2 g-mb-2 g-text-site-dir-start">
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
            <h4>
              {useChecklistBankLink && (
                <>
                  <a
                    href={externalTaxonLink}
                    target="_blank"
                    className="g-text-site-dir-start g-text-lg g-font-medium g-text-gray-900 g-underline hover:g-text-primary-500"
                    rel="noopener noreferrer"
                    dangerouslySetInnerHTML={{
                      __html: classification.taxonMatch?.usage.formattedName ?? usageName,
                    }}
                  />{' '}
                  <ExternalLinkIcon className="g-align-baseline" />
                </>
              )}
              {!useChecklistBankLink && (
                <DynamicLink
                  className="g-text-site-dir-start g-text-lg g-font-medium g-text-gray-900 g-underline hover:g-text-primary-500"
                  pageId="taxonKey"
                  variables={{ key: usageKey }}
                  dangerouslySetInnerHTML={{
                    __html: classification.taxonMatch?.usage.formattedName ?? usageName,
                  }}
                />
              )}
            </h4>
            <Classification dir="ltr" className="g-text-xs g-text-slate-600 g-text-site-dir-start">
              {classification.classification?.map((rank) => {
                return (
                  <span key={rank.key}>
                    {rank.rank && (
                      <span className="g-pe-1">
                        <FormattedMessage
                          id={`enums.taxonRank.${rank.rank}`}
                          defaultMessage={rank.rank}
                        />
                      </span>
                    )}
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
            {classification.acceptedUsage.key && classification.acceptedUsage.key !== usageKey && (
              <div className="g-text-xs g-text-slate-700 g-mt-2">
                {classification.taxonMatch?.synonym && (
                  <span className="g-me-4 g-bg-orange-400 g-rounded-full g-px-2 g-text-white">
                    <FormattedMessage id="enums.taxonomicStatus.SYNONYM" defaultMessage="Synonym" />
                  </span>
                )}
                <span className="g-text-slate-600 g-font-medium">
                  accepted name:{' '}
                  <DynamicLink
                    pageId="taxonKey"
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

export function ChecklistNoMatchCard({ checklistKey }: { checklistKey: string }) {
  return (
    <div className="g-mb-4 g-w-full g-bg-slate-100 g-rounded">
      <div className="g-p-4">
        <div className="g-flex g-items-center g-gap-2 g-mb-2">
          <span className="g-text-sm g-font-medium g-text-slate-600">
            <DatasetLabel id={checklistKey} />
          </span>
        </div>
        <div className="g-flex g-flex-wrap g-gap-1 g-text-xs g-text-slate-700">
          <BsLightningFill className="g-flex-none g-h-[1.2em]" style={{ color: 'orange' }} />
          <FormattedMessage
            id="occurrenceDetails.taxonInterpretation.noMatch"
            defaultMessage="Could not be interpreted"
          />
        </div>
      </div>
    </div>
  );
}
