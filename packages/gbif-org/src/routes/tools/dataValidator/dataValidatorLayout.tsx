import { useLocation, useParams } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { ToolLayout, ToolLayoutTab } from '../_shared/toolLayout';
import { ValidationProvider, useValidation } from './data/validationContext';
import { ApiContent } from './help';

export function DataValidatorLayout() {
  const { key } = useParams<{ key?: string }>();
  return (
    <ValidationProvider validationKey={key}>
      <DataValidatorTabs validationKey={key} />
    </ValidationProvider>
  );
}

function DataValidatorTabs({ validationKey }: { validationKey?: string }) {
  const { pathname } = useLocation();
  const { validation } = useValidation();
  const isAbout = pathname.endsWith('/about');
  const isMyValidations = pathname.endsWith('/my-validations');
  const isDocument = !!validationKey && pathname.endsWith('/document');
  const isReport = !!validationKey && !isDocument;
  const hasMetadata = validation?.status === 'FINISHED' && validation?.fileFormat === 'DWCA';
  const keySegment = validationKey ? encodeURIComponent(validationKey) : '';

  const tabs = ({ hasCmsResource }: { hasCmsResource: boolean }): ToolLayoutTab[] => [
    {
      to: '.',
      isActive: !validationKey && !isAbout && !isMyValidations,
      children: (
        <FormattedMessage
          id="tools.dataValidator.tabs.newValidation"
          defaultMessage="New validation"
        />
      ),
    },
    {
      to: keySegment,
      isActive: isReport,
      hidden: !validationKey,
      children: <FormattedMessage id="tools.dataValidator.tabs.report" defaultMessage="Report" />,
    },
    {
      to: `${keySegment}/document`,
      isActive: isDocument,
      hidden: !validationKey || (!hasMetadata && !isDocument),
      children: (
        <FormattedMessage id="tools.dataValidator.tabs.metadata" defaultMessage="Metadata" />
      ),
    },
    {
      to: 'my-validations',
      isActive: isMyValidations,
      children: (
        <FormattedMessage
          id="tools.dataValidator.tabs.myValidations"
          defaultMessage="My validations"
        />
      ),
    },
    {
      to: 'about',
      isActive: isAbout,
      hidden: !hasCmsResource,
      children: <FormattedMessage id="cms.resource.about" defaultMessage="About" />,
    },
  ];

  return <ToolLayout defaultTitle="Data validator" apiContent={<ApiContent />} tabs={tabs} />;
}
