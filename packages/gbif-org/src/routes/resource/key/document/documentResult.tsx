import { DocumentResultFragment } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { fragmentManager } from '@/services/fragmentManager';
import { cn } from '@/utils/shadcn';

fragmentManager.register(/* GraphQL */ `
  fragment DocumentResult on Document {
    id
    title
    excerpt
  }
`);

type Props = {
  document: DocumentResultFragment;
  className?: string;
};

export function DocumentResult({ document, className }: Props) {
  const link = `/document/${document.id}`;
  return (
    <article className={cn('g-bg-slate-50 g-p-4 g-rounded g-border g-mb-4', className)}>
      <h3 className="g-flex-auto g-text-base g-font-semibold g-mb-2">
        <DynamicLink to={link}>{document.title}</DynamicLink>
      </h3>
      <div className="g-font-normal g-text-slate-500 g-text-sm g-flex">
        <div className="g-flex-auto">
          {document.excerpt}
          <div className="g-text-sm g-text-slate-500 g-mt-2">
            <div className="g-flex g-items-center">
              <span className="g-align-middle g-bg-slate-300/50 g-text-slate-800 g-text-xs g-font-medium g-me-2 g-px-2.5 g-py-0.5 g-rounded dark:g-bg-red-900 dark:g-text-red-300">
                Document
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
