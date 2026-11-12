import { LongDate } from '@/components/dateFormats';
import { Card } from '@/components/ui/largeCard';
import { ValidationResultFragment } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { fragmentManager } from '@/services/fragmentManager';
import { cn } from '@/utils/shadcn';
import { FormattedMessage } from 'react-intl';

fragmentManager.register(/* GraphQL */ `
  fragment ValidationResult on Validation {
    key
    created
    file
    fileFormat
    status
    metrics {
      indexeable
    }
  }
`);

interface ValidationResultProps {
  validation: ValidationResultFragment;
  onCancel?: (key: string) => void;
}

export function ValidationResult({ validation }: ValidationResultProps) {
  const finished = validation.status === 'FINISHED';
  const indexable = finished && validation.metrics?.indexeable === true;

  return (
    <DynamicLink to={`/tools/data-validator/${encodeURIComponent(validation.key)}`}>
      <Card className="g-mb-4 hover:g-shadow-lg g-transition-shadow g-duration-300 hover:g-border-primary-300">
        <article>
          <div className="g-p-4 g-flex g-items-start g-justify-between g-gap-4">
            <div className="g-min-w-0">
              <h3 className="g-text-base g-font-semibold g-break-all" dir="auto">
                {validation.file}
              </h3>
              <p className="g-mt-1 g-text-sm g-text-slate-600">
                <FormattedMessage id="downloadKey.created" />:{' '}
                {validation.created ? (
                  <LongDate value={validation?.created} />
                ) : (
                  <FormattedMessage id="phrases.unknownDate" />
                )}
              </p>
            </div>
            <span
              className={cn('g-flex-none g-rounded g-px-2 g-text-sm', {
                'g-bg-green-500 g-text-green-100': validation.status === 'FINISHED',
                'g-bg-red-300 g-text-red-900': validation.status !== 'FINISHED',
              })}
            >
              {validation.status}
            </span>
          </div>
          {(finished || validation.status === 'FAILED') && (
            <p className="g-flex g-items-center g-gap-2 g-border-t g-border-slate-100 g-px-4 g-py-2.5 g-text-sm">
              <span
                aria-hidden
                className={cn('g-inline-block g-h-2 g-w-2 g-flex-none g-rounded-full', {
                  'g-bg-green-500': indexable,
                  'g-bg-red-500': !indexable,
                })}
              />
              {indexable ? (
                <FormattedMessage
                  id="tools.dataValidator.indexeable"
                  defaultMessage="The file can be indexed by GBIF"
                />
              ) : (
                <FormattedMessage
                  id="tools.dataValidator.notIndexeable"
                  defaultMessage="The file cannot be indexed by GBIF"
                />
              )}
            </p>
          )}
        </article>
      </Card>
    </DynamicLink>
  );
}
