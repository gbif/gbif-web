import { cn } from '@/utils/shadcn';

type Props = {
  children: React.ReactNode;
  className?: string;
  topPadded?: boolean;
  bottomPadded?: boolean;
  hasDataHeader?: boolean;
};

export function PageContainer({
  className,
  topPadded,
  hasDataHeader,
  bottomPadded,
  children,
}: Props) {
  let topPadding = topPadded ? 'g-pt-4 lg:g-pt-12' : '';
  if (hasDataHeader && topPadded) {
    topPadding = 'g-pt-2 lg:g-pt-8';
  }
  return (
    <div
      className={cn(
        `g-px-4 lg:g-px-8 ${topPadding} ${bottomPadded ? 'g-pb-4 lg:g-pb-8' : ''}`,
        className
      )}
    >
      {children}
    </div>
  );
}
