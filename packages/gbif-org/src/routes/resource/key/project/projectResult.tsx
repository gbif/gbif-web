import { ResultCard } from '@/components/resultCards/index';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { AddFilterEvent } from '@/contexts/filter';
import { ProjectResultFragment } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { fragmentManager } from '@/services/fragmentManager';
import { FormattedMessage } from 'react-intl';

fragmentManager.register(/* GraphQL */ `
  fragment ProjectResult on GbifProject {
    id
    title
    excerpt
    primaryImage {
      ...ResultCardImage
    }
    createdAt
    programme {
      id
      title
    }
    purposes
  }
`);

type Props = {
  project: ProjectResultFragment;
  className?: string;
};

export function ProjectResult({ project, className }: Props) {
  const link = `/project/${project.id}`;
  return (
    <ResultCard.Container className={className}>
      <ResultCard.Header title={project.title} link={link} contentType="cms.contentType.project" />
      <div className="g-flex g-gap-4">
        <ResultCard.Content>
          {project.excerpt}
          <ResultCard.Metadata>
            {project.programme && (
              <div>
                <FormattedMessage id="cms.project.programme" />:{' '}
                <DynamicLink
                  className="hover:g-underline"
                  pageId="programme-key"
                  variables={{ key: project.programme.id }}
                >
                  {project.programme.title}
                </DynamicLink>
              </div>
            )}
            {project.purposes && (
              <div className="g-pt-2 g-flex g-gap-2">
                {project.purposes.map((x) => (
                  <SimpleTooltip key={x} i18nKey="filterSupport.setFilter" side="right" asChild>
                    <ResultCard.Tag
                      key={x}
                      onClick={() => window.dispatchEvent(new AddFilterEvent('purposes', x))}
                    >
                      <FormattedMessage id={`enums.purposes.${x}`} />
                    </ResultCard.Tag>
                  </SimpleTooltip>
                ))}
              </div>
            )}
          </ResultCard.Metadata>
        </ResultCard.Content>
        {project.primaryImage && <ResultCard.Image image={project.primaryImage} link={link} />}
      </div>
    </ResultCard.Container>
  );
}
