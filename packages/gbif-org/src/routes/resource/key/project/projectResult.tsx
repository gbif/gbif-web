import { ProjectResultFragment } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { fragmentManager } from '@/services/fragmentManager';
import { cn } from '@/utils/shadcn';
import { MdCalendarToday } from 'react-icons/md';
import { FormattedDate } from 'react-intl';

fragmentManager.register(/* GraphQL */ `
  fragment ProjectResult on GbifProject {
    id
    title
    excerpt
    primaryImage {
      file {
        url: thumbor(width: 300, height: 150)
      }
    }
    createdAt
  }
`);

type Props = {
  project: ProjectResultFragment;
  className?: string;
};

export function ProjectResult({ project, className }: Props) {
  const link = `/project/${project.id}`;
  return (
    <article className={cn('g-bg-slate-50 g-p-4 g-rounded g-border g-mb-4', className)}>
      <h3 className="g-flex-auto g-text-base g-font-semibold g-mb-2">
        <DynamicLink to={link}>{project.title}</DynamicLink>
      </h3>
      <div className="g-font-normal g-text-slate-500 g-text-sm g-flex">
        <div className="g-flex-auto">
          {project.excerpt}
          <div className="g-text-sm g-text-slate-500 g-mt-2">
            <div className="g-flex g-items-center">
              <span className="g-align-middle g-bg-slate-300/50 g-text-slate-800 g-text-xs g-font-medium g-me-2 g-px-2.5 g-py-0.5 g-rounded dark:g-bg-red-900 dark:g-text-red-300">
                Project
              </span>
              <MdCalendarToday className="g-me-2" /> Published{' '}
              <FormattedDate value={project.createdAt} year="numeric" month="short" day="numeric" />
            </div>
          </div>
        </div>
        {project?.primaryImage?.file?.url && (
          <div className="g-flex-none">
            <DynamicLink to={link} tabIndex={-1}>
              <img
                className="g-w-32 g-border g-border-slate-200/50 g-rounded g-ms-4"
                src={project.primaryImage.file.url}
              />
            </DynamicLink>
          </div>
        )}
      </div>
    </article>
  );
}
