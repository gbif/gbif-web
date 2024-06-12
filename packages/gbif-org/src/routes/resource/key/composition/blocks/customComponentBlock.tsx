import { CustomComponentBlockDetailsFragment } from '@/gql/graphql';
import { ArticleTextContainer } from '../../components/articleTextContainer';
import { fragmentManager } from '@/services/fragmentManager';
import { BlockContainer, backgroundColorMap } from './_shared';
import { HostedPortalForm } from './custom-components/HostedPortalForm';
import { BecomeAPublisherForm } from './custom-components/BecomeAPublisherForm';
import { SuggestDatasetForm } from './custom-components/SuggestDatasetForm';

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
    // We could add the other forms as custom components in the future,
    // but our contentful data does not have them yet and adding them would make the transition to the new gbif.org less smooth.
    case 'hostedPortalForm':
      // return <SuggestDatasetForm />;
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
