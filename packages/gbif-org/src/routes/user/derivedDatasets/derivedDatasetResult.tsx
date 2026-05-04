import { LongDate } from '@/components/dateFormats';
import { DoiTag } from '@/components/identifierTag';
import { Tag } from '@/components/resultCards';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/largeCard';
import { DerivedDatasetResultFragment } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { fragmentManager } from '@/services/fragmentManager';
import { FormattedMessage } from 'react-intl';

fragmentManager.register(/* GraphQL */ `
  fragment DerivedDatasetResult on DerivedDataset {
    doi
    title
    excerpt
    created
    contributingDatasets {
      count
    }
  }
`);

interface DerivedDatasetResultProps {
  derivedDataset: DerivedDatasetResultFragment;
  onCancel?: (key: string) => void;
}

function splitDoi(doi: string): { prefix: string; suffix: string } {
  const i = doi.indexOf('/');
  if (i < 0) return { prefix: doi, suffix: '' };
  return { prefix: doi.slice(0, i), suffix: doi.slice(i + 1) };
}

export function DerivedDatasetResult({ derivedDataset }: DerivedDatasetResultProps) {
  const { prefix, suffix } = splitDoi(derivedDataset.doi);

  return (
    <Card className="g-mb-4 hover:g-shadow-lg g-transition-shadow g-duration-300">
      <article className="g-p-4 g-flex g-flex-col sm:g-flex-row sm:g-items-start g-gap-3">
        <div className="g-flex-1 g-min-w-0 g-flex g-flex-col g-gap-2">
          <DynamicLink
            pageId="derivedDatasetKey"
            variables={{ doiPrefix: prefix, doiSuffix: suffix }}
            className="hover:g-text-primary-600 g-no-underline"
          >
            <h3 className="g-text-base g-font-semibold">
              {derivedDataset.title || derivedDataset.doi}
            </h3>
          </DynamicLink>

          {derivedDataset.excerpt && (
            <p className="g-text-sm g-text-slate-600 g-line-clamp-3">{derivedDataset.excerpt}</p>
          )}

          <div className="g-flex g-flex-wrap g-gap-4 g-text-sm g-text-slate-600 g-items-center">
            <DoiTag id={derivedDataset.doi} className="g-me-2 g-text-xs g-hidden md:g-inline" />
            {typeof derivedDataset.contributingDatasets?.count === 'number' && (
              <Tag>
                <FormattedMessage
                  id="counts.nDatasets"
                  values={{ total: derivedDataset.contributingDatasets.count }}
                />
              </Tag>
            )}
            <div>
              <FormattedMessage id="downloadKey.created" />:{' '}
              {derivedDataset.created ? (
                <LongDate value={derivedDataset.created} />
              ) : (
                <FormattedMessage id="phrases.unknownDate" />
              )}
            </div>
          </div>
        </div>

        {prefix && suffix && (
          <div className="g-shrink-0">
            <Button asChild size="sm" variant="outline">
              <DynamicLink to={`/derived-dataset/edit/${prefix}/${suffix}`}>
                <FormattedMessage id="tools.derivedDataset.edit" defaultMessage="Edit" />
              </DynamicLink>
            </Button>
          </div>
        )}
      </article>
    </Card>
  );
}
