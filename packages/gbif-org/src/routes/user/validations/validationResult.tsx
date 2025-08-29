import { defaultDateFormatProps } from '@/components/headerComponents';
import { Card } from '@/components/ui/largeCard';
import { ValidationResultFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';
import { cn } from '@/utils/shadcn';
import { FormattedDate, FormattedMessage } from 'react-intl';

fragmentManager.register(/* GraphQL */ `
  fragment ValidationResult on Validation {
    key
    created
    file
    fileFormat
    status
  }
`);

interface ValidationResultProps {
  validation: ValidationResultFragment;
  onCancel?: (key: string) => void;
}

export function ValidationResult({ validation }: ValidationResultProps) {
  return (
    <a href={`${import.meta.env.PUBLIC_GBIF_ORG}/tools/data-validator/${validation.key}`}>
      <Card className="g-mb-4 hover:g-shadow-lg g-transition-shadow g-duration-300 hover:g-border-primary-300">
        <article className="">
          <div className="g-p-4 g-flex g-flex-col g-gap-2">
            <div className="g-flex g-justify-between g-items-start">
              <div className="g-flex-grow">
                <div className="g-flex g-items-center g-gap-2">
                  <h3 className="g-text-base g-font-semibold">{validation.file}</h3>
                </div>
              </div>
            </div>

            <div className="g-flex g-flex-wrap g-gap-4 g-text-sm g-text-slate-600 g-items-center">
              <div>
                <FormattedMessage id="downloadKey.created" />:{' '}
                {validation.created ? (
                  <FormattedDate value={validation?.created} {...defaultDateFormatProps} />
                ) : (
                  <FormattedMessage id="phrases.unknownDate" />
                )}
              </div>
              <span
                className={cn('g-rounded g-px-2 g-text-sm', {
                  'g-bg-green-500 g-text-green-100': validation.status === 'FINISHED',
                  'g-bg-red-300 g-text-red-900': validation.status !== 'FINISHED',
                })}
              >
                {validation.status}
              </span>
            </div>
          </div>
        </article>
      </Card>
    </a>
  );
}
