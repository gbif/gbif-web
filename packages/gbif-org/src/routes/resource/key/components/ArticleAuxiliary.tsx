import { cn } from '@/utils/shadcn';

type Props = {
  label?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  dangerouslySetInnerHTML?: React.HTMLAttributes<HTMLDivElement>['dangerouslySetInnerHTML'] & {
    classNames?: string;
  };
};

const contentClassNames = 'text-slate-500 dark:text-slate-400 text-sm';

export function ArticleAuxiliary({ className, label, children, dangerouslySetInnerHTML }: Props) {
  return (
    <div className={cn('mt-8', className)}>
      {label && <h3 className="font-bold mb-2 text-slate-700 dark:text-slate-400">{label}</h3>}
      {dangerouslySetInnerHTML && (
        <div
          className={cn(contentClassNames, dangerouslySetInnerHTML.classNames)}
          dangerouslySetInnerHTML={dangerouslySetInnerHTML}
        />
      )}
      {children && <div className={contentClassNames}>{children}</div>}
    </div>
  );
}
