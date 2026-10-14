import { DynamicLink } from '@/reactRouterPlugins/dynamicLink';
import { cn } from '@/utils/shadcn';

type Props = {
  label?: React.ReactNode;
  pills: Array<{ key: string; content: React.ReactNode; searchParams?: Record<string, string> }>;
  className?: string;
};

const pillClassName =
  'g-bg-slate-200 g-text-slate-800 dark:g-text-slate-400 dark:g-bg-zinc-800/80 g-py-1 g-px-2 g-rounded-full g-m-1 g-inline-block';

export function Pills({ label, pills, className }: Props) {
  return (
    <div className={cn(className)}>
      {label && <span className="g-me-4">{label}</span>}

      {pills.map(({ key, content, searchParams }) =>
        searchParams ? (
          <DynamicLink
            key={key}
            pageId="resourceSearch"
            searchParams={searchParams}
            className={cn(pillClassName, 'hover:g-bg-slate-300 dark:hover:g-bg-zinc-700')}
          >
            {content}
          </DynamicLink>
        ) : (
          <span key={key} className={pillClassName}>
            {content}
          </span>
        )
      )}
    </div>
  );
}
