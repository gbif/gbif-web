import { cn } from '@/utils/shadcn';

type Props = {
  label?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  dangerouslySetValue?: React.HTMLAttributes<HTMLDivElement>['dangerouslySetInnerHTML'] & {
    classNames?: string;
  };
};

const contentClassNames = 'g-text-slate-500 dark:g-text-slate-400 g-text-sm';

export function ArticleAuxiliary({ className, label, children, dangerouslySetValue }: Props) {
  return (
    <div className={cn('g-mt-8', className)}>
      {label && (
        <h3 className='g-font-bold g-text-sm g-mb-2 g-text-slate-700 dark:g-text-slate-400'>{label}</h3>
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
