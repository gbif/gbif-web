import { CustomComponentBlockDetailsFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';
import { backgroundColorMap, BlockContainer } from './_shared';
import { AmbassadorsList } from './customComponents/ambassadorsList';
import { EbbeWinnersTable } from './customComponents/ebbeWinnersList';
import { GraList } from './customComponents/graList';
import { HostedPortalForm } from './customComponents/hostedPortalForm';
import { MdtForm } from './customComponents/mdtForm';
import { MentorsList } from './customComponents/mentorsList';
import { ProjectsTable } from './customComponents/projects';
import { PublisherDatasetTable } from './customComponents/publisherDatasetTable';
import { TranslatorsList } from './customComponents/translatorsList';
import { ProtectedForm } from '@/components/protectedForm';
import { FormattedMessage } from 'react-intl';

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

export const widthMap: Record<string, string> = {
  narrow: 'g-max-w-3xl g-m-auto',
  normal: 'g-max-w-5xl g-m-auto',
  wide: 'g-max-w-6xl g-m-auto',
  fluid: 'g-max-w-full g-m-auto',
};

type Props = {
  resource: CustomComponentBlockDetailsFragment;
};

export function CustomComponentBlock({ resource }: Props) {
  // This is a temporary fix to make the new hosted portal form work with the current contentful data.
  const mofitiedResource = overwriteHostedPortalFormDetails(resource);

  const backgroundColor = backgroundColorMap[mofitiedResource?.backgroundColour ?? 'white'];
  const width = widthMap[mofitiedResource?.width ?? 'normal'];
  return (
    <BlockContainer className={`${backgroundColor} g-border-t g-border-slate-100 g-p-0`}>
      {/* <ArticleTextContainer> */}
      <div className={width}>
        <CustomComponent resource={mofitiedResource} />
      </div>
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
    case 'translatorsList':
      return (
        <TranslatorsList title={resource?.title} tableStyle={resource?.settings?.tablestyle} />
      );
    case 'ambassadorsList':
      return (
        <AmbassadorsList title={resource?.title} tableStyle={resource?.settings?.tablestyle} />
      );
    case 'mentorsList':
      return <MentorsList title={resource?.title} tableStyle={resource?.settings?.tablestyle} />;
    case 'graList':
      return <GraList title={resource?.title} tableStyle={resource?.settings?.tablestyle} />;
    case 'ebbeWinnersList':
      return (
        <EbbeWinnersTable title={resource?.title} tableStyle={resource?.settings?.tablestyle} />
      );
    case 'metabarcodingDataToolForm':
      return <MdtForm />;
    case 'hostedPortalForm':
      return <HostedPortalForm />;
    case 'projects':
      return (
        <ProjectsTable
          className="g-py-8"
          programmeId={resource?.settings?.programmeId}
          tableStyle={resource?.settings?.tablestyle}
        />
      );
    case 'publisherOrDatasetTable':
      return (
        <PublisherDatasetTable
          className="g-py-8"
          settings={resource?.settings}
          title={resource?.title}
        />
      );
    default:
      return <pre>Unknown block: {JSON.stringify(resource, null, 2)}</pre>;
  }
}

// TODO: REMOVE
// The current settings for the hosted portal form does not suit the new hosted portal form.
// This function is meant to be temporary until the new site has been deplyed and the contentful data can be updated.
function overwriteHostedPortalFormDetails(
  resource: CustomComponentBlockDetailsFragment
): CustomComponentBlockDetailsFragment {
  if (resource.componentType === 'hostedPortalForm') {
    return {
      ...resource,
      width: 'fluid',
      backgroundColour: 'white',
    };
  }

  return resource;
}
