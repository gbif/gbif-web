import { ProgrammeResultFragment } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { fragmentManager } from '@/services/fragmentManager';
import { cn } from '@/utils/shadcn';

fragmentManager.register(/* GraphQL */ `
  fragment ProgrammeResult on Programme {
    id
    title
    excerpt
    primaryImage {
      file {
        url: thumbor(width: 300, height: 150)
      }
    }
  }
`);

type Props = {
  programme: ProgrammeResultFragment;
  className?: string;
};

export function ProgrammeResult({ programme, className }: Props) {
  const link = `/programme/${programme.id}`;
  return (
    <article className={cn('g-bg-slate-50 g-p-4 g-rounded g-border g-mb-4', className)}>
      <h3 className="g-flex-auto g-text-base g-font-semibold g-mb-2">
        <DynamicLink to={link}>{programme.title}</DynamicLink>
      </h3>
      <div className="g-font-normal g-text-slate-500 g-text-sm g-flex">
        <div className="g-flex-auto">
          {programme.excerpt}
          <div className="g-text-sm g-text-slate-500 g-mt-2">
            <div className="g-flex g-items-center">
              <span className="g-align-middle g-bg-slate-300/50 g-text-slate-800 g-text-xs g-font-medium g-me-2 g-px-2.5 g-py-0.5 g-rounded dark:g-bg-red-900 dark:g-text-red-300">
                Programme
              </span>
            </div>
          </div>
        </div>
        {programme?.primaryImage?.file?.url && (
          <div className="g-flex-none">
            <DynamicLink to={link} tabIndex={-1}>
              <img
                className="g-w-32 g-border g-border-slate-200/50 g-rounded g-ms-4"
                src={programme.primaryImage.file.url}
              />
            </DynamicLink>
          </div>
        )}
      </div>
    </article>
  );
}
