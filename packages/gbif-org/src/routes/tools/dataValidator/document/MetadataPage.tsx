import { ContactList } from '@/components/contactList';
import { HyperText } from '@/components/hyperText';
import { ProtectedForm } from '@/components/protectedForm';
import { TableOfContents } from '@/components/tableOfContents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { useConfig } from '@/config/config';
import { UserError, useUser } from '@/contexts/UserContext';
import useBelow from '@/hooks/useBelow';
import { BibliographicCitations } from '@/routes/dataset/key/about/BibliographicCitations';
import { GeographicCoverages } from '@/routes/dataset/key/about/GeographicCoverages';
import { SamplingDescription } from '@/routes/dataset/key/about/SamplingDescription';
import { TaxonomicCoverages } from '@/routes/dataset/key/about/TaxonomicCoverages';
import { TemporalCoverages } from '@/routes/dataset/key/about/TemporalCoverages';
import { Aside, AsideSticky, SidebarLayout } from '@/routes/occurrence/key/pagelayouts';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { ComponentProps, ReactElement, ReactNode, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { ToolCardSkeleton } from '../../_shared/toolCardSkeleton';
import { useValidation } from '../data/validationContext';
import {
  fetchEml,
  ValidatorErrorKind,
  validatorErrorKind,
  ValidatorHttpError,
} from '../data/validatorApi';
import { ContactingServer, ValidationFailure } from '../report/ValidationStatus';
import { ValidatorErrorMessage } from '../validatorErrorMessage';
import { emlAdapter, EmlView, hasEmlContent } from './emlAdapter';

type EmlState =
  | { status: 'loading' }
  | { status: 'loaded'; view: EmlView }
  | { status: 'error'; kind: ValidatorErrorKind };

export default function MetadataPage() {
  return (
    <ProtectedForm
      className="g-bg-white g-flex-1"
      title={
        <FormattedMessage
          id="tools.dataValidator.loginToSeeReport"
          defaultMessage="Sign in to see this validation report"
        />
      }
      message={
        <FormattedMessage
          id="tools.dataValidator.loginToSeeReportMessage"
          defaultMessage="You need a GBIF account to see validation reports."
        />
      }
    >
      <Container>
        <MetadataBody />
      </Container>
    </ProtectedForm>
  );
}

function Container({ children }: { children: ReactNode }) {
  return (
    <PageContainer className="g-bg-slate-100 g-flex-1">
      <ArticleTextContainer className="g-max-w-screen-xl g-pt-6 g-pb-12">
        {children}
      </ArticleTextContainer>
    </PageContainer>
  );
}

function MetadataBody() {
  const { state, validation, validationKey } = useValidation();

  if (state.phase === 'error' && !validation) return <ValidationFailure state={state} />;
  if (!validation || state.phase === 'loading' || state.phase === 'contacting') {
    return <ContactingServer />;
  }
  if (validation.status !== 'FINISHED' || validation.fileFormat !== 'DWCA' || !validationKey) {
    return (
      <Card className="g-p-6 g-text-slate-600">
        <FormattedMessage
          id="tools.dataValidator.metadataUnavailable"
          defaultMessage="Metadata is shown for finished validations of Darwin Core Archives only."
        />
      </Card>
    );
  }
  return <EmlDocument validationKey={validationKey} />;
}

function useEml(validationKey: string): EmlState {
  const { getApiToken } = useUser();
  const { v1Endpoint } = useConfig();
  const [state, setState] = useState<EmlState>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });
    const load = async (forceRefresh: boolean): Promise<unknown> => {
      const token = await getApiToken({ forceRefresh });
      return fetchEml({ v1Endpoint, token, key: validationKey, signal: controller.signal });
    };
    load(false)
      .catch((error) => {
        const auth =
          error instanceof ValidatorHttpError && (error.status === 401 || error.status === 403);
        if (auth) return load(true);
        throw error;
      })
      .then((eml) => setState({ status: 'loaded', view: emlAdapter(eml) }))
      .catch((error) => {
        if (controller.signal.aborted) return;
        const kind =
          error instanceof UserError && error.type === 'UNKNOWN_USER'
            ? 'unauthorized'
            : validatorErrorKind(error);
        setState({ status: 'error', kind });
      });
    return () => controller.abort();
    // getApiToken changes identity with the user only
  }, [validationKey, v1Endpoint, getApiToken]);

  return state;
}

function EmlDocument({ validationKey }: { validationKey: string }) {
  const eml = useEml(validationKey);
  const removeSidebar = useBelow(1100);

  if (eml.status === 'loading') return <ToolCardSkeleton />;
  if (eml.status === 'error') {
    return (
      <Card className="g-p-6">
        <p role="alert" className="g-text-red-700">
          <ValidatorErrorMessage kind={eml.kind} />
        </p>
      </Card>
    );
  }
  if (!hasEmlContent(eml.view)) {
    return (
      <Card className="g-p-6 g-text-slate-600">
        <FormattedMessage
          id="tools.dataValidator.noMetadata"
          defaultMessage="No metadata was found in the archive."
        />
      </Card>
    );
  }

  return <EmlSections view={eml.view} removeSidebar={removeSidebar} />;
}

type Section = { id: string; title: ReactElement; body: ReactNode; hidden: boolean };

function EmlSections({ view, removeSidebar }: { view: EmlView; removeSidebar: boolean }) {
  const sections: Section[] = useMemo(
    () => [
      {
        id: 'eml-description',
        hidden: !view.title && !view.description,
        title: <FormattedMessage id="dataset.description" defaultMessage="Description" />,
        body: (
          <>
            {view.title && (
              <h2 className="g-text-xl g-font-semibold g-mb-3" dir="auto">
                {view.title}
              </h2>
            )}
            <HyperText className="g-prose g-max-w-full" text={view.description} />
          </>
        ),
      },
      {
        id: 'eml-purpose',
        hidden: !view.purpose,
        title: <FormattedMessage id="dataset.purpose" defaultMessage="Purpose" />,
        body: <HyperText className="g-prose g-max-w-full" text={view.purpose} />,
      },
      {
        id: 'eml-temporal',
        hidden: view.temporalCoverages.length === 0,
        title: (
          <FormattedMessage id="dataset.temporalCoverages" defaultMessage="Temporal coverage" />
        ),
        body: (
          <TemporalCoverages
            temporalCoverages={
              view.temporalCoverages as ComponentProps<
                typeof TemporalCoverages
              >['temporalCoverages']
            }
          />
        ),
      },
      {
        id: 'eml-geographic',
        hidden: view.geographicCoverages.length === 0,
        title: (
          <FormattedMessage id="dataset.geographicCoverages" defaultMessage="Geographic coverage" />
        ),
        body: (
          <GeographicCoverages
            geographicCoverages={
              view.geographicCoverages as ComponentProps<
                typeof GeographicCoverages
              >['geographicCoverages']
            }
          />
        ),
      },
      {
        id: 'eml-taxonomic',
        hidden: view.taxonomicCoverages.length === 0,
        title: (
          <FormattedMessage id="dataset.taxonomicCoverages" defaultMessage="Taxonomic coverage" />
        ),
        body: (
          <TaxonomicCoverages
            taxonomicCoverages={
              view.taxonomicCoverages as ComponentProps<
                typeof TaxonomicCoverages
              >['taxonomicCoverages']
            }
          />
        ),
      },
      {
        id: 'eml-methodology',
        hidden: !view.samplingDescription,
        title: <FormattedMessage id="dataset.methodology" defaultMessage="Methodology" />,
        body: (
          <SamplingDescription
            dataset={{
              samplingDescription: view.samplingDescription as ComponentProps<
                typeof SamplingDescription
              >['dataset']['samplingDescription'],
            }}
          />
        ),
      },
      {
        id: 'eml-additional-info',
        hidden: !view.additionalInfo,
        title: <FormattedMessage id="dataset.additionalInfo" defaultMessage="Additional info" />,
        body: <HyperText className="g-prose g-max-w-full" text={view.additionalInfo} />,
      },
      {
        id: 'eml-bibliography',
        hidden: view.bibliographicCitations.length === 0,
        title: <FormattedMessage id="dataset.bibliography" defaultMessage="Bibliography" />,
        body: (
          <BibliographicCitations
            bibliographicCitations={
              view.bibliographicCitations as ComponentProps<
                typeof BibliographicCitations
              >['bibliographicCitations']
            }
            cap={200}
          />
        ),
      },
      {
        id: 'eml-contacts',
        hidden: view.contacts.length === 0,
        title: <FormattedMessage id="dataset.contacts" defaultMessage="Contacts" />,
        body: <ContactList contacts={view.contacts} cap={100} />,
      },
    ],
    [view]
  );
  const visible = sections.filter((section) => !section.hidden);

  return (
    <SidebarLayout
      reverse
      className="g-grid-cols-[1fr_250px] xl:g-grid-cols-[1fr_300px]"
      stack={removeSidebar}
    >
      <div className="g-min-w-0">
        {visible.map((section) => (
          <Card key={section.id} id={section.id} className="g-mb-4 gbif-word-break">
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent dir="auto">{section.body}</CardContent>
          </Card>
        ))}
      </div>
      {!removeSidebar && (
        <Aside>
          <AsideSticky className="-g-mt-4">
            <Card>
              <h4 className="g-text-sm g-font-semibold g-mx-4 g-mt-3 g-text-slate-600">
                <FormattedMessage id="phrases.pageToc" defaultMessage="On this page" />
              </h4>
              <nav className="g-pb-2">
                <TableOfContents sections={visible} />
              </nav>
            </Card>
          </AsideSticky>
        </Aside>
      )}
    </SidebarLayout>
  );
}
