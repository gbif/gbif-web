import { defaultDateFormatProps } from '@/components/headerComponents';
import { DoiTag } from '@/components/identifierTag';
import { Card } from '@/components/ui/largeCard';
import { DerivedDatasetResultFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';
import { FormattedDate, FormattedMessage } from 'react-intl';

fragmentManager.register(/* GraphQL */ `
  fragment DerivedDatasetResult on DerivedDataset {
    doi
    title
    created
  }
`);

interface DerivedDatasetResultProps {
  derivedDataset: DerivedDatasetResultFragment;
  onCancel?: (key: string) => void;
}

export function DerivedDatasetResult({ derivedDataset }: DerivedDatasetResultProps) {
  return (
    <a href={`${import.meta.env.PUBLIC_GBIF_ORG}/derivedDataset/${derivedDataset.doi}`}>
      <Card className="g-mb-4 hover:g-shadow-lg g-transition-shadow g-duration-300 hover:g-border-primary-300">
        <article className="">
          <div className="g-p-4 g-flex g-flex-col g-gap-2">
            <div className="g-flex g-justify-between g-items-start">
              <div className="g-flex-grow">
                <div className="g-flex g-items-center g-gap-2">
                  <h3 className="g-text-base g-font-semibold">
                    {derivedDataset.title || derivedDataset.doi}
                  </h3>
                </div>
              </div>
            </div>

            <div className="g-flex g-flex-wrap g-gap-4 g-text-sm g-text-slate-600 g-items-center">
              <DoiTag id={derivedDataset.doi} className="g-me-2 g-text-xs g-hidden md:g-inline" />
              <div>
                <FormattedMessage id="downloadKey.created" />:{' '}
                {derivedDataset.created ? (
                  <FormattedDate value={derivedDataset?.created} {...defaultDateFormatProps} />
                ) : (
                  <FormattedMessage id="phrases.unknownDate" />
                )}
              </div>
            </div>
          </div>
        </article>
      </Card>
    </a>
  );
}
