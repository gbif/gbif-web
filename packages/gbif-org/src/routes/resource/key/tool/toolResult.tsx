import { ResultCard } from '@/components/resultCards/index';
import { ToolResultFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';
import { gbifUrlAsRelative } from '@/utils/gbifUrl';

fragmentManager.register(/* GraphQL */ `
  fragment ToolResult on Tool {
    id
    title
    excerpt
    primaryLink {
      url
    }
    primaryImage {
      ...ResultCardImage
    }
  }
`);

type Props = {
  tool: ToolResultFragment;
  className?: string;
};

export function ToolResult({ tool, className }: Props) {
  const link = gbifUrlAsRelative(tool.primaryLink?.url) ?? `/tool/${tool.id}`;
  return (
    <ResultCard.Container className={className}>
      <ResultCard.Header title={tool.title} link={link} contentType="cms.contentType.tool" />
      <div className="g-flex g-gap-4">
        <ResultCard.Content>{tool.excerpt}</ResultCard.Content>
        {tool.primaryImage && (
          <ResultCard.Image image={tool.primaryImage} link={link} hideOnSmall />
        )}
      </div>
    </ResultCard.Container>
  );
}
