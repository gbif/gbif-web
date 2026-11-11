import { ProtectedForm } from '@/components/protectedForm';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { Validations } from '@/routes/user/validations/validations';
import { FormattedMessage } from 'react-intl';

// the same list as the profile's validations page
export default function MyValidationsPage() {
  return (
    <ProtectedForm
      className="g-bg-white g-flex-1"
      title={
        <FormattedMessage
          id="tools.dataValidator.loginToSeeValidations"
          defaultMessage="Sign in to see your validations"
        />
      }
      message={
        <FormattedMessage
          id="tools.dataValidator.loginToSeeReportMessage"
          defaultMessage="You need a GBIF account to see validation reports."
        />
      }
    >
      <PageContainer className="g-bg-slate-100 g-flex-1">
        <ArticleTextContainer className="g-pt-6 g-pb-12">
          <Validations />
        </ArticleTextContainer>
      </PageContainer>
    </ProtectedForm>
  );
}
