import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { ToolLayout, ToolLayoutTab } from '../_shared/toolLayout';
import { useDataValidatorCmsData } from './data/useDataValidatorCmsData';
import { ApiContent } from './help';

export function DataValidatorRootLayout() {
  const { pathname } = useLocation();
  const data = useDataValidatorCmsData();
  const isAbout = pathname.endsWith('/about');
  const isMyValidations = pathname.endsWith('/my-validations');

  const tabs = ({ hasCmsResource }: { hasCmsResource: boolean }): ToolLayoutTab[] => [
    {
      to: '.',
      isActive: !isAbout && !isMyValidations,
      children: (
        <FormattedMessage
          id="tools.dataValidator.tabs.newValidation"
          defaultMessage="New validation"
        />
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

  return (
    <ToolLayout defaultTitle="Data validator" apiContent={<ApiContent />} tabs={tabs} data={data} />
  );
}
