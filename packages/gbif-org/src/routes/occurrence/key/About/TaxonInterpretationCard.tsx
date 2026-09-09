import { BulletList } from '@/components/bulletList';
import { Classification } from '@/components/classification';
import { DatasetLabel } from '@/components/filters/displayNames';
import { useConfig } from '@/config/config';
import { EntityLinkPresentation } from '@/components/entityLink';
import { ChecklistClassification } from '@/gql/graphql';
import { useTaxonLinks } from '@/hooks/useTaxonLinks';
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
  const links = useTaxonLinks({
    checklistKey: classification.checklistKey,
    clbDatasetKey: classification?.meta?.mainIndex?.clbDatasetKey,
  });
  const usageKey = classification?.usage?.key;
  const usageLabel = classification.taxonMatch?.usage.formattedName ?? classification?.usage?.name;
  const acceptedLabel =
    classification?.acceptedUsage?.taxon?.label ?? classification?.acceptedUsage?.name;
  const acceptedKey = classification?.acceptedUsage?.key;
  const taxonomy =
    classification?.acceptedUsage?.taxon?.classification ?? classification.classification;

  const noMatch = !usageKey || !usageLabel;
  if (noMatch) return <ChecklistNoMatchCard checklistKey={classification.checklistKey} />;
  const issues = classification?.issues ?? [];

  const formattedName = acceptedLabel ?? usageLabel;

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
              <EntityLinkPresentation
                link={links.dataset}
                className="g-text-sm g-font-medium g-text-slate-600 hover:g-text-primary-500"
              >
                {classification?.meta?.mainIndex?.datasetTitle}
              </EntityLinkPresentation>
            </div>
            <h4>
              <EntityLinkPresentation
                link={links.taxon(acceptedKey ?? usageKey)}
                className="g-text-site-dir-start g-text-lg g-font-medium g-text-gray-900 g-underline hover:g-text-primary-500"
                dangerouslySetInnerHTML={{ __html: formattedName }}
              />
              {links.taxon(usageKey).kind === 'external' && (
                <>
                  {' '}
                  <ExternalLinkIcon className="g-align-baseline" />
                </>
              )}
            </h4>
            <Classification dir="ltr" className="g-text-xs g-text-slate-600 g-text-site-dir-start">
              {taxonomy?.map((rank) => {
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
              <div className="g-text-sm g-text-slate-700 g-mt-2">
                <span className="g-text-slate-600 g-font-medium">
                  <FormattedMessage
                    id="filterSupport.acceptedNameOf"
                    defaultMessage="Accepted name for"
                  />
                  :{' '}
                  <EntityLinkPresentation
                    link={links.taxon(usageKey)}
                    className="g-text-site-dir-start g-font-medium g-underline hover:g-text-primary-500"
                    dangerouslySetInnerHTML={{ __html: usageLabel }}
                  />
                  {links.taxon(usageKey).kind === 'external' && (
                    <>
                      {' '}
                      <ExternalLinkIcon className="g-align-baseline" />
                    </>
                  )}
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
