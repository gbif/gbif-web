import { CustomComponentBlockDetailsFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';
import { backgroundColorMap, BlockContainer } from './_shared';
import { HostedPortalForm } from './customComponents/hostedPortalForm';
import { ProjectsTable } from './customComponents/projects';

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

  return (
    <BlockContainer className={`${backgroundColor} g-border-t g-border-slate-100 g-p-0`}>
      {/* <ArticleTextContainer> */}
      <CustomComponent resource={resource} />
      {/* </ArticleTextContainer> */}
    </BlockContainer>
  );
}

function CustomComponent({
  resource,
}: {
  resource: CustomComponentBlockDetailsFragment;
}): React.ReactElement {
  if (!resource || !resource.componentType) {
    return null;
  }
  switch (resource.componentType) {
    // We could add the other forms as custom components in the future,
    // but our contentful data does not have them yet and adding them would make the transition to the new gbif.org less smooth.
    case 'hostedPortalForm':
      return <HostedPortalForm className="g-bg-white" />;
    case 'projects':
      return (
        <ProjectsTable
          className="g-py-8"
          programmeId={resource?.settings?.programmeId}
          tableStyle={resource?.settings?.tablestyle}
        />
      );
    default:
      return <pre>Unknown block: {JSON.stringify(resource, null, 2)}</pre>;
  }
}
