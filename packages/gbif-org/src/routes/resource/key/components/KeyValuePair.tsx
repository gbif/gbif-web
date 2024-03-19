import { cn } from '@/utils/shadcn';

type Props = {
  // Can't be named key because it's a reserved by react
  label: React.ReactNode;
  value?: React.ReactNode;
  className?: string;
  dangerouslySetValue?: React.HTMLAttributes<HTMLDivElement>['dangerouslySetInnerHTML'] & {
    classNames?: string;
  };
};

export function KeyValuePair({ label, value, className, dangerouslySetValue }: Props) {
  return (
    <div className={cn('mb-1', className)}>
      <span className="font-semibold">{label}: </span>
      {dangerouslySetValue && (
        <span
          className={dangerouslySetValue.classNames}
          dangerouslySetInnerHTML={dangerouslySetValue}
        />
      )}
      {value && <span>{value}</span>}
    </div>
  );
}
