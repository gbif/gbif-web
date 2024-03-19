import { cn } from '@/utils/shadcn';

type Props = {
  label?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  dangerouslySetValue?: React.HTMLAttributes<HTMLDivElement>['dangerouslySetInnerHTML'] & {
    classNames?: string;
  };
};

const contentClassNames = 'text-slate-500 dark:text-slate-400 text-sm';

export function ArticleAuxiliary({ className, label, children, dangerouslySetValue }: Props) {
  return (
    <div className={cn('mt-8', className)}>
      {label && (
        <h3 className="font-bold text-sm mb-2 text-slate-700 dark:text-slate-400">{label}</h3>
      )}
      {dangerouslySetValue && (
        <div
          className={cn(contentClassNames, dangerouslySetValue.classNames)}
          dangerouslySetInnerHTML={dangerouslySetValue}
        />
      )}
      {children && <div className={contentClassNames}>{children}</div>}
    </div>
  );
}
