import { BulletList } from '@/components/bulletList';
import { Classification } from '@/components/classification';
import { ChecklistClassification } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { BsLightningFill } from 'react-icons/bs';
import { MdLink } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';

const speciesPageDatasetKey = import.meta.env.PUBLIC_GBIF_DEFAULT_TAXONOMY_DATASET_KEY;
export function TaxonInterpretationCard({
  classification,
}: {
  classification: ChecklistClassification;
}) {
  const useChecklistBankLink = speciesPageDatasetKey !== classification.checklistKey;
  const noMatch = classification?.usage?.key.toString() === '0';

  return (
    <div className="g-mb-4 g-w-full g-bg-slate-100 g-rounded">
      <div className="g-overflow-hidden g-transition-all g-duration-300">
        <div className="g-p-4 g-flex g-items-start g-justify-between">
          <div className="g-flex-1">
            <div className="g-flex g-items-center g-space-x-2 g-mb-2">
              {useChecklistBankLink && noMatch && (
                <a
                  href={`https://www.checklistbank.org/dataset/${classification?.meta?.mainIndex.datasetKey}/about`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="g-text-sm g-font-medium g-text-slate-600 hover:g-text-primary-500"
                >
                  {classification?.meta?.mainIndex?.datasetTitle} <MdLink />
                </a>
              )}
              {useChecklistBankLink && !noMatch && (
                <a
                  href={`https://www.checklistbank.org/dataset/${
                    classification?.meta?.mainIndex.datasetKey
                  }/taxon/${encodeURIComponent(classification?.usage?.key)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="g-text-sm g-font-medium g-text-slate-600 hover:g-text-primary-500"
                >
                  {classification?.meta?.mainIndex?.datasetTitle} <MdLink />
                </a>
              )}
              {!useChecklistBankLink && (
                <DynamicLink
                  className="g-text-sm g-font-medium g-text-slate-600 hover:g-text-primary-500"
                  pageId="speciesKey"
                  variables={{ key: classification?.usage?.key }}
                >
                  {classification?.meta?.mainIndex?.datasetTitle}
                </DynamicLink>
              )}
            </div>

            <h4
              className="g-text-lg g-font-medium g-text-gray-900"
              dangerouslySetInnerHTML={{
                __html:
                  classification.taxonMatch?.usage.formattedName ??
                  classification.taxonMatch?.usage.name,
              }}
            />
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

            <div className="g-mt-2 g-flex g-flex-wrap g-gap-1 g-text-xs g-text-slate-700 ">
              <BsLightningFill className="g-flex-none g-h-[1.2em]" style={{ color: 'orange' }} />
              <BulletList>
                {classification?.issues?.map((issue) => (
                  <li key={issue}>
                    <FormattedMessage
                      id={`enums.occurrenceIssue.${issue}`}
                      defaultMessage={issue}
                    />
                  </li>
                ))}
              </BulletList>
              {classification.taxonMatch?.synonym && (
                <span className="g-ms-4 g-bg-orange-400 g-rounded-full g-px-2 g-text-white">
                  <FormattedMessage id="enums.taxonomicStatus.SYNONYM" defaultMessage="Synonym" />
                </span>
              )}
            </div>
            {classification.acceptedUsage.key !== classification.usage.key && (
              <div className="g-text-xs g-text-slate-700 g-mt-2">
                {classification.taxonMatch?.synonym && (
                  <span className="g-ms-4 g-bg-orange-400 g-rounded-full g-px-2 g-text-white">
                    <FormattedMessage id="enums.taxonomicStatus.SYNONYM" defaultMessage="Synonym" />
                  </span>
                )}
                <span className="g-text-slate-600 g-font-medium">
                  accepted name:{' '}
                  <DynamicLink
                    pageId="speciesKey"
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
