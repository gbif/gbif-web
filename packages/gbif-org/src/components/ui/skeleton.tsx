import { cn } from '@/utils/shadcn';

export const skeletonClasses =
  'g-animate-pulse g-rounded-md g-bg-slate-900/10 g-text-transparent [&>*]:g-invisible';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden className={cn(skeletonClasses, className)} {...props} />;
}

function SkeletonTable({ rows, columns }: { rows: number; columns: number }) {
  return (
    <table className="g-w-full g-text-sm g-text-left rtl:g-text-right g-text-gray-500 dark:g-text-gray-400">
      <thead className="g-text-slate-500 g-font-light g-bg-gray-50 dark:g-bg-gray-700 dark:g-text-gray-400 g-border-b">
        <tr>
          {Array.from({ length: columns }).map((_, i) => (
            <th key={i} className="g-px-4 md:g-px-8 g-py-3 g-font-normal">
              <Skeleton className="g-w-12">&nbsp;</Skeleton>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <tr
            key={i}
            className="g-bg-white g-border-b last:g-border-0 dark:g-bg-gray-800 dark:g-border-gray-700"
          >
            {Array.from({ length: columns }).map((_, j) => (
              <td key={j} className="g-px-4 md:g-px-8 g-py-3">
                <Skeleton className="g-w-24">&nbsp;</Skeleton>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function SkeletonParagraph({
  className,
  lines = 3,
  ...props
}: {
  className?: string;
  lines?: number;
} & React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <>
      {Array.from({ length: lines - 1 }).map((_, i) => (
        <p
          key={i}
          className={`${skeletonClasses} ${className} g-inline-block g-mb-1 g-w-full`}
          {...props}
        >
          Loading
        </p>
      ))}
      <p className={`${skeletonClasses} ${className} g-inline-block g-mb-1 g-w-2/5`} {...props}>
        Loading
      </p>
    </>
  );
}

export { Skeleton, SkeletonTable };
