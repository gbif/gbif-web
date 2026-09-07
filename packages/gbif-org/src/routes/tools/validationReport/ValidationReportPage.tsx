import { DatasetOption, DatasetSearchSuggest } from '@/components/searchSelect/datasetSearchSuggest';
import { CardListSkeleton } from '@/components/skeletonLoaders';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/largeCard';
import {
  ValidationReportDatasetPickerQuery,
  ValidationReportDatasetPickerQueryVariables,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { useEffect } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { DatasetValidationReport } from './DatasetValidationReport';

const DATASET_PICKER_QUERY = /* GraphQL */ `
  query ValidationReportDatasetPicker($key: ID!) {
    dataset(key: $key) {
      key
      title
    }
  }
`;

export default function ValidationReportPage() {
  const navigate = useNavigate();
  const { key } = useParams<{ key?: string }>();

  const { data, load, loading } = useQuery<
    ValidationReportDatasetPickerQuery,
    ValidationReportDatasetPickerQueryVariables
  >(DATASET_PICKER_QUERY, { throwAllErrors: false, lazyLoad: true, notifyOnErrors: false });

  useEffect(() => {
    if (key) load({ variables: { key } });
  }, [load, key]);

  const dataset = key ? data?.dataset : undefined;
  const selected: DatasetOption | null = dataset ? { key: dataset.key, title: dataset.title ?? dataset.key } : null;

  const handleSelect = (value: DatasetOption | null | undefined) => {
    navigate(value ? `/tools/validation-report/dataset/${value.key}` : '/tools/validation-report');
  };

  return (
    <PageContainer className="g-bg-slate-100 g-flex-1">
      <ArticleTextContainer className="g-pt-8 g-pb-4 g-max-w-screen-xl">
        <Card className="g-bg-white g-overflow-hidden">
          {dataset ? (
            <CardContent
              topPadding
              className="g-flex g-items-center g-justify-between g-gap-4 g-flex-wrap"
            >
              <div className="g-min-w-0">
                <div className="g-text-xs g-font-medium g-uppercase g-tracking-wide g-text-slate-500">
                  <FormattedMessage id="tools.validationReport.dataset" defaultMessage="Dataset" />
                </div>
                <DynamicLink
                  to={`/dataset/${dataset.key}`}
                  pageId="datasetKey"
                  variables={{ key: dataset.key }}
                  className="g-text-lg g-font-semibold g-text-slate-800 hover:g-underline"
                >
                  {dataset.title}
                </DynamicLink>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleSelect(null)}>
                <MdArrowBack size={16} className="g-me-1.5" />
                <FormattedMessage
                  id="tools.validationReport.backToSearch"
                  defaultMessage="Back to search"
                />
              </Button>
            </CardContent>
          ) : (
            <>
              <div className="g-px-6 g-pt-6 g-pb-4 g-border-b g-border-slate-100">
                <h2 className="g-text-base g-font-semibold g-text-slate-800">
                  <FormattedMessage
                    id="tools.validationReport.selectDataset"
                    defaultMessage="Select a dataset"
                  />
                </h2>
                <p className="g-text-slate-700 g-text-sm g-leading-relaxed g-mt-2">
                  <FormattedMessage
                    id="tools.validationReport.selectDatasetDescription"
                    defaultMessage="Look up a dataset already registered with GBIF to see its Darwin Core data package validation report."
                  />
                </p>
              </div>
              <CardContent topPadding>
                <DatasetSearchSuggest
                  selected={selected}
                  setSelected={handleSelect}
                  noSelectionPlaceholder={
                    <FormattedMessage
                      id="tools.validationReport.selectDatasetPlaceholder"
                      defaultMessage="Select a dataset"
                    />
                  }
                />
                {key && !loading && (
                  <p className="g-text-sm g-text-red-600 g-mt-3">
                    <FormattedMessage
                      id="tools.validationReport.datasetNotFound"
                      defaultMessage="This dataset could not be found."
                    />
                  </p>
                )}
              </CardContent>
            </>
          )}
        </Card>
      </ArticleTextContainer>

      {key && loading && (
        <ArticleTextContainer className="g-max-w-screen-xl">
          <CardListSkeleton />
        </ArticleTextContainer>
      )}
      {key && !loading && dataset && <DatasetValidationReport datasetKey={key} />}
    </PageContainer>
  );
}
