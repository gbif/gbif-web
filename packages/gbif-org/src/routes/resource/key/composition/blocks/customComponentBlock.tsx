import { CustomComponentBlockDetailsFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';
import { backgroundColorMap, BlockContainer, getAnchorId } from './_shared';
import { EbbeWinnersTable } from './customComponents/ebbeWinnersList';
import { DnaReferenceLibraryList } from './customComponents/dnaReferenceLibraries';
import { GraList } from './customComponents/graList';
import { HostedPortalForm } from './customComponents/hostedPortalForm';
import { MdtForm } from './customComponents/mdtForm';
import { ProjectsTable } from './customComponents/projects';
import { PublisherDatasetTable } from './customComponents/publisherDatasetTable';
import { VolunteersList } from './customComponents/volunteersList';

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
  const mofitiedResource = overwriteFormDetails(resource);

  const backgroundColor = backgroundColorMap[mofitiedResource?.backgroundColour ?? 'white'];
  const width = widthMap[mofitiedResource?.width ?? 'normal'];
  return (
    <BlockContainer
      id={getAnchorId(resource.title)}
      className={`${backgroundColor} g-border-t g-border-slate-100 g-p-0`}
    >
      {/* <ArticleTextContainer> */}
      <div className={width}>
        <CustomComponent resource={mofitiedResource} />
      </div>
      {/* </ArticleTextContainer> */}
    </BlockContainer>
  );
}

const LEGACY_VOLUNTEER_ROLES: Record<string, string | undefined> = {
  translatorsList: 'TRANSLATOR',
  ambassadorsList: 'AMBASSADOR',
  mentorsList: 'MENTOR',
};

function CustomComponent({
  resource,
}: {
  resource: CustomComponentBlockDetailsFragment;
}): React.ReactElement | null {
  if (!resource || !resource.componentType) {
    return null;
  }
  switch (resource.componentType) {
    // We could add the other forms as custom components in the future,
    // but our contentful data does not have them yet and adding them would make the transition to the new gbif.org less smooth.
    // The volunteer lists share one component. The legacy component types are kept so existing
    // contentful blocks keep working, they just default to their role. Settings on the block win.
    case 'volunteersList':
    case 'translatorsList':
    case 'ambassadorsList':
    case 'mentorsList':
      return (
        <VolunteersList
          title={resource?.title ?? undefined}
          settings={{
            role: LEGACY_VOLUNTEER_ROLES[resource.componentType],
            ...resource?.settings,
          }}
        />
      );
    case 'graList':
      return (
        <GraList title={resource?.title ?? undefined} tableStyle={resource?.settings?.tablestyle} />
      );
    case 'ebbeWinnersList':
      return (
        <EbbeWinnersTable
          title={resource?.title ?? undefined}
          tableStyle={resource?.settings?.tablestyle}
        />
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
          title={resource?.title ?? undefined}
        />
      );
    case 'dnaReferenceLibraryList':
      return <DnaReferenceLibraryList className="g-py-8" title={resource?.title ?? undefined} />;
    default:
      return <pre>Unknown block: {JSON.stringify(resource, null, 2)}</pre>;
  }
}

// TODO: REMOVE
// The current settings for some of the forms does not suit the form format.
// This function is meant to be temporary until the new site has been deplyed and the contentful data can be updated.
function overwriteFormDetails(
  resource: CustomComponentBlockDetailsFragment
): CustomComponentBlockDetailsFragment {
  if (resource.componentType === 'hostedPortalForm') {
    return {
      ...resource,
      width: 'fluid',
      backgroundColour: 'white',
    };
  }

  if (resource.componentType === 'metabarcodingDataToolForm') {
    return {
      ...resource,
      width: 'fluid',
      backgroundColour: 'white',
    };
  }

  return resource;
}
