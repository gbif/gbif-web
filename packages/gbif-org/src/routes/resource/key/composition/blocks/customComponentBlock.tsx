import { CustomComponentBlockDetailsFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';
import { ArticleTextContainer } from '../../components/articleTextContainer';
import { HostedPortalForm } from './customComponents/hostedPortalForm';
import { backgroundColorMap, BlockContainer } from './_shared';

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
  const backgroundColor = backgroundColorMap[resource?.backgroundColour ?? 'white'];

  switch (resource.componentType) {
    // We could add the other forms as custom components in the future,
    // but our contentful data does not have them yet and adding them would make the transition to the new gbif.org less smooth.
    case 'hostedPortalForm':
      return <HostedPortalForm className="g-bg-white" />;
  }

  return (
    <BlockContainer className={backgroundColor}>
      <ArticleTextContainer>
        <pre>{JSON.stringify(resource, null, 2)}</pre>
      </ArticleTextContainer>
    </BlockContainer>
  );
}
