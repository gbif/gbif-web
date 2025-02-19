import { DataUseResult } from '../key/dataUse/dataUseResult';
import { DocumentResult } from '../key/document/documentResult';
import { EventResult } from '../key/event/eventResult';
import { NewsResult } from '../key/news/newsResult';
import { ProgrammeResult } from '../key/programme/programmeResult';
import { ProjectResult } from '../key/project/projectResult';
import { ToolResult } from '../key/tool/toolResult';
import { Resource } from './resourceSearch';

type Props = {
  resource: Resource;
  className?: string;
};

export function ResourceSearchResult({ resource, className }: Props) {
  switch (resource.__typename) {
    case 'News':
      return <NewsResult className={className} news={resource} />;
    case 'DataUse':
      return <DataUseResult className={className} dataUse={resource} />;
    case 'MeetingEvent':
      return <EventResult className={className} event={resource} />;
    case 'GbifProject':
      return <ProjectResult className={className} project={resource} />;
    case 'Programme':
      return <ProgrammeResult className={className} programme={resource} />;
    case 'Tool':
      return <ToolResult className={className} tool={resource} />;
    case 'Document':
      return <DocumentResult className={className} document={resource} />;
  }

  console.warn(
    // @ts-ignore
    `<ResourceSearchResult /> did not expect to receive a resource of __typename ${resource.__typename}`
  );
  console.log(resource);
  return null;
}
