import { DataHeader } from '@/components/dataHeader';
import { HeaderInfo, HeaderInfoEdit, HeaderInfoMain } from '@/components/headerComponents';
import { FeatureList, GenericFeature } from '@/components/highlights';
import PageMetaData from '@/components/PageMetaData';
import { Tabs } from '@/components/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { DynamicLink } from '@/reactRouterPlugins';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import {
  MdCheckCircle,
  MdError,
  MdInfoOutline,
  MdOutlineInsertDriveFile,
  MdOutlineSdStorage,
} from 'react-icons/md';
import { FormattedDate, FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { extractCmsResource } from '../_shared/toolLayout';
import { fileSize } from './data/normalizeReport';
import { isInProgress } from './data/pollingMachine';
import type { Validation } from './data/types';
import { useDataValidatorCmsData } from './data/useDataValidatorCmsData';
import { ValidationProvider, useValidation } from './data/validationContext';
import { ApiContent } from './help';
import { useLabels } from './report/useLabels';

const dateTimeFormat = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
} as const;

export function DataValidatorKeyLayout() {
  const { key } = useParams<{ key: string }>();
  return (
    <ValidationProvider validationKey={key}>
      <DataValidatorKeyPage />
    </ValidationProvider>
  );
}

function DataValidatorKeyPage() {
  const { pathname } = useLocation();
  const { formatMessage } = useIntl();
  const { state, validation, loginRequired } = useValidation();
  const toolTitle = extractCmsResource(useDataValidatorCmsData())?.title ?? 'Data validator';
  const isDocument = pathname.endsWith('/document');
  const hasMetadata = validation?.status === 'FINISHED' && validation?.fileFormat === 'DWCA';
  const isLoading = !validation && !loginRequired && state.phase !== 'error';
  const fallbackTitle = formatMessage({
    id: 'tools.dataValidator.validationReport',
    defaultMessage: 'Validation report',
  });

  return (
    <>
      <PageMetaData title={validation?.file ?? toolTitle} path={pathname} />
      <DataHeader hideCatalogueSelector className="g-bg-white" apiContent={<ApiContent />} />
      <article className="g-min-h-screen g-flex g-flex-col g-bg-slate-100">
        <PageContainer topPadded hasDataHeader className="g-bg-white g-border-b">
          <ArticleTextContainer className="g-max-w-screen-xl">
            <ArticlePreTitle
              clickable
              secondary={
                validation?.created && (
                  <FormattedDate
                    value={validation.created}
                    {...dateTimeFormat}
                    timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
                  />
                )
              }
            >
              <DynamicLink to="/tools/data-validator">
                <span dangerouslySetInnerHTML={{ __html: toolTitle }} />
              </DynamicLink>
            </ArticlePreTitle>

            {isLoading ? (
              <div className="g-flex g-h-8 g-items-center md:g-h-9" aria-hidden>
                <Skeleton className="g-h-7 g-w-full g-max-w-xl" />
              </div>
            ) : (
              <ArticleTitle className="lg:g-text-3xl g-break-all" dir="auto">
                {validation?.file ?? fallbackTitle}
              </ArticleTitle>
            )}

            <HeaderInfo>
              <HeaderInfoMain>
                {validation && <Features validation={validation} />}
                {isLoading && <FeaturesSkeleton />}
              </HeaderInfoMain>
              <HeaderInfoEdit className="g-flex g-mt-4 md:g-mt-0 g-gap-2">
                <Button asChild variant="outline" className="g-py-1 g-px-2 g-h-[2rem]">
                  <DynamicLink to="/tools/data-validator/my-validations">
                    <span className="g-whitespace-nowrap">
                      <FormattedMessage
                        id="tools.dataValidator.tabs.myValidations"
                        defaultMessage="My validations"
                      />
                    </span>
                  </DynamicLink>
                </Button>
                <Button asChild className="g-py-1 g-px-2 g-h-[2rem]">
                  <DynamicLink to="/tools/data-validator">
                    <span className="g-whitespace-nowrap">
                      <FormattedMessage
                        id="tools.dataValidator.tabs.newValidation"
                        defaultMessage="New validation"
                      />
                    </span>
                  </DynamicLink>
                </Button>
              </HeaderInfoEdit>
            </HeaderInfo>

            <Tabs
              className="g-mt-4 g-border-none"
              disableAutoDetectActive
              links={[
                {
                  to: '.',
                  isActive: !isDocument,
                  children: (
                    <FormattedMessage
                      id="tools.dataValidator.tabs.report"
                      defaultMessage="Report"
                    />
                  ),
                },
                {
                  to: 'document',
                  isActive: isDocument,
                  hidden: !hasMetadata && !isDocument,
                  children: (
                    <FormattedMessage
                      id="tools.dataValidator.tabs.metadata"
                      defaultMessage="Metadata"
                    />
                  ),
                },
              ]}
            />
          </ArticleTextContainer>
        </PageContainer>

        <Outlet />
      </article>
    </>
  );
}

function Features({ validation }: { validation: Validation }) {
  const labels = useLabels();
  const size = fileSize(validation.fileSize);

  return (
    <FeatureList>
      <StatusFeature status={validation.status} />
      {validation.fileFormat && (
        <GenericFeature>
          <MdOutlineInsertDriveFile />
          <span>{labels.fileFormat(validation.fileFormat)}</span>
        </GenericFeature>
      )}
      {size && (
        <GenericFeature>
          <MdOutlineSdStorage />
          <span>
            <FormattedNumber value={size.value} style="unit" unit={size.unit} />
          </span>
        </GenericFeature>
      )}
    </FeatureList>
  );
}

const FEATURE_WIDTHS = ['g-w-40', 'g-w-48', 'g-w-16'];

function FeaturesSkeleton() {
  return (
    <FeatureList aria-hidden>
      {FEATURE_WIDTHS.map((width) => (
        <GenericFeature key={width}>
          <Skeleton className={width}>Loading</Skeleton>
        </GenericFeature>
      ))}
    </FeatureList>
  );
}

function StatusFeature({ status }: { status?: string }) {
  const labels = useLabels();

  if (isInProgress(status)) {
    return (
      <GenericFeature className="g-items-center g-gap-2" aria-live="polite">
        <Spinner className="g-h-4 g-w-4" />
        <span>{labels.status(status!)}</span>
      </GenericFeature>
    );
  }
  if (status === 'FINISHED') {
    return (
      <GenericFeature aria-live="polite">
        <MdCheckCircle className="g-text-green-600" />
        <span>{labels.status(status)}</span>
      </GenericFeature>
    );
  }
  if (status === 'FAILED') {
    return (
      <GenericFeature className="g-text-red-700" aria-live="polite">
        <MdError />
        <span>
          <FormattedMessage
            id="tools.dataValidator.validationFailed"
            defaultMessage="Validation failed"
          />
        </span>
      </GenericFeature>
    );
  }
  return (
    <GenericFeature aria-live="polite">
      <MdInfoOutline />
      <span>{labels.status(status || 'UNKNOWN')}</span>
    </GenericFeature>
  );
}
