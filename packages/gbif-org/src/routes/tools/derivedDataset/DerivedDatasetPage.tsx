import { FormSuccess } from '@/components/formSuccess';
import { ProtectedForm } from '@/components/protectedForm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/largeCard';
import { DynamicLink } from '@/reactRouterPlugins';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useToolCmsResource } from '../_shared/toolLayout';
import { RegistrationForm } from './registrationForm';
import { RegistrationResult } from './types';

export default function DerivedDatasetPage() {
  const cmsResource = useToolCmsResource();
  const [result, setResult] = useState<RegistrationResult | null>(null);

  return (
    <PageContainer className="g-bg-slate-100 g-flex-1">
      <ArticleTextContainer className="g-pt-8 g-pb-12">
        <Card className="g-bg-white g-overflow-hidden">
          <div className="g-px-6 g-pt-6 g-pb-4 g-border-b g-border-slate-100">
            <h2 className="g-text-base g-font-semibold g-text-slate-800">
              <FormattedMessage
                id="tools.derivedDataset.registerNew"
                defaultMessage="Register a new derived dataset"
              />
            </h2>
            <p className="g-text-slate-700 g-text-sm g-leading-relaxed g-mt-2">
              <FormattedMessage
                id="tools.derivedDataset.description"
                defaultMessage="Cite a derived dataset that you have created from GBIF mediated data — e.g. data filtered or augmented for a study. We will mint a DOI for the derived dataset so it can be cited and linked back to the underlying datasets."
              />
            </p>
            {cmsResource && (
              <p className="g-text-slate-500 g-text-sm g-mt-3">
                <FormattedMessage
                  id="tools.derivedDataset.aboutHint"
                  defaultMessage="See the {aboutLink} for more on derived datasets."
                  values={{
                    aboutLink: (
                      <DynamicLink to="about" className="g-underline g-text-primary-600">
                        <FormattedMessage
                          id="tools.derivedDataset.aboutPage"
                          defaultMessage="about page"
                        />
                      </DynamicLink>
                    ),
                  }}
                />
              </p>
            )}
          </div>

          <div className="g-p-6">
            <ProtectedForm
              title={
                <FormattedMessage
                  id="tools.derivedDataset.loginRequiredTitle"
                  defaultMessage="Sign in to register a derived dataset"
                />
              }
              message={
                <FormattedMessage
                  id="tools.derivedDataset.loginRequiredMessage"
                  defaultMessage="A GBIF account is required to register a derived dataset and mint a DOI."
                />
              }
            >
              {result ? (
                <FormSuccess
                  title={
                    <FormattedMessage
                      id="tools.derivedDataset.registrationCompleted"
                      defaultMessage="Registration completed"
                    />
                  }
                  message={
                    <FormattedMessage
                      id="tools.derivedDataset.registrationCompletedMessage"
                      defaultMessage="Your derived dataset has been registered with DOI {doi}."
                      values={{ doi: <code>{result.doi}</code> }}
                    />
                  }
                  action={
                    <Button asChild>
                      <a
                        href={`https://doi.org/${result.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FormattedMessage
                          id="tools.derivedDataset.goToDataset"
                          defaultMessage="Go to dataset"
                        />
                      </a>
                    </Button>
                  }
                  resetMessage={
                    <FormattedMessage
                      id="tools.derivedDataset.newRegistration"
                      defaultMessage="Register another"
                    />
                  }
                  onReset={() => setResult(null)}
                />
              ) : (
                <RegistrationForm mode="create" onSuccess={setResult} />
              )}
            </ProtectedForm>
          </div>
        </Card>
      </ArticleTextContainer>
    </PageContainer>
  );
}
