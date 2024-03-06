import { cn } from '@/utils/shadcn';

type Props = {
  // Can't be named key because it's a reserved by react
  label: React.ReactNode;
  value?: React.ReactNode;
  className?: string;
  dangerouslySetInnerHTML?: React.HTMLAttributes<HTMLDivElement>['dangerouslySetInnerHTML'] & {
    classNames?: string;
  };
};

export function KeyValuePair({ label, value, className, dangerouslySetInnerHTML }: Props) {
  return (
    <div className={cn('mb-1', className)}>
      <span className="font-semibold">{label}: </span>
      {dangerouslySetInnerHTML && (
        <span
          className={dangerouslySetInnerHTML.classNames}
          dangerouslySetInnerHTML={dangerouslySetInnerHTML}
        />
      )}
      {value && <span>{value}</span>}
    </div>
  );
}
