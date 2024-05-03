import { CustomComponentBlockDetailsFragment } from '@/gql/graphql';
import { ArticleTextContainer } from '../../components/ArticleTextContainer';
import { fragmentManager } from '@/services/FragmentManager';
import { BlockContainer, backgroundColorMap } from './_shared';
import { HostedPortalForm } from './custom-components/HostedPortalForm2';
import { BecomeAPublisherForm } from './custom-components/BecomeAPublisherForm';

fragmentManager.register(/* GraphQL */ `
  fragment CustomComponentBlockDetails on CustomComponentBlock {
    id
    componentType
    title
    width
    backgroundColour
    settings
  }
`);

type Props = {
  resource: CustomComponentBlockDetailsFragment;
};

export function CustomComponentBlock({ resource }: Props) {
  switch (resource.componentType) {
    case 'hostedPortalForm':
      // return <HostedPortalForm />;
      return <BecomeAPublisherForm />;
  }

  const backgroundColor = backgroundColorMap[resource?.backgroundColour ?? 'white'];

  return (
    <BlockContainer className={backgroundColor}>
      <ArticleTextContainer>
        <pre>{JSON.stringify(resource, null, 2)}</pre>
      </ArticleTextContainer>
    </BlockContainer>
  );
}
